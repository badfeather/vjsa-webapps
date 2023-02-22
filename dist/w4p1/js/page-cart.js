import {component, store} from '../../js/vendor/reef.es.js';
import {fetchPhotos, getPhotoByID} from './components/photos.js';
import {stripeURL} from './components/endpoints.js';
import {
	// getCartDetails,
	increaseCartItemQuantity,
	decreaseCartItemQuantity,
	deleteCartItem,
	emptyCart,
	getCartItem
} from './components/cart.js';

let photos = [],
	status = store([]),
	submitting = false;

function getCartHTML () {
	let photosInCart = photos.filter(function (photo) {
		return getCartItem(photo.id);
	});

	// If there are no items in the cart
	if (!photosInCart.length) {
		return `
		<div aria-live="polite">${status.join('<br>')}</div>
		<p>No items in cart.</p>
		`;
	}

	let cartTotalPrice = 0,
		cartTotalQty = 0;
	let html = `
	<table class="cart">
		<tr>
			<th class="item-thumb"></th>
			<th class="item-name">Photo</th>
			<th class="item-cost-per-unit">Cost per unit</th>
			<th class="item-qty">Quantity</th>
			<th class="item-price">Price</th>
		</tr>
	`;
	for (let photo of photosInCart) {
		let item = getCartItem(photo.id);
		let rowPrice = photo.price * item.qty;
		cartTotalPrice += rowPrice;
		cartTotalQty += item.qty;
		html += `
		<tr>
			<td class="item-thumb"><img alt="${photo.description}" src="${photo.url}"></td>
			<td class="item-name"><strong>${photo.name}</strong></td>
			<td class="item-cost-per-unit">${photo.price}</td>
			<td class="item-qty"><button class="adjust-qty" data-decrease-item-qty="${item.id}" aria-label="Decrease item quantity">-</button> ${item.qty} <button class="adjust-qty" data-increase-item-qty="${item.id}" aria-label="Increase item quantity">+</button> <button class="delete-item" data-delete-item="${item.id}" aria-label="Delete item">X</button></td>
			<td class="item-price">$${rowPrice}</td>
		</tr>
		`;
	}
	html += `
		<tr class="cart-totals">
			<td colspan="3"><strong>TOTAL</strong></td>
			<td class="total-qty">${cartTotalQty} Items</td>
			<td class="cart-total">$${cartTotalPrice}</td>
		</tr>
	</table>
	<p><button data-checkout>Complete Checkout</button></p>
	<p><button data-empty-cart>Empty Cart</button></p>
	<p aria-live="polite">${status.join('<br>')}</p>
	`;
	return html;
}

/**
 * Complete user checkout
 * @param  {Event} event The event object
 */
async function checkoutClickHandler (event) {
	let btn = event.target.closest('[data-checkout]');
	if (!btn) return;
	let currentURL = window.location.href;
	let successURL = currentURL.replace("/cart/", "/success/");
	console.log(currentURL, successURL);

	let photosInCart = photos.filter(function (photo) {
		return getCartItem(photo.id);
	});
	if ( ! photosInCart.length ) {
		status.push( 'No items in cart' );
		return;
	}
	let stripeData = {
		line_items: photosInCart.map(function (photo) {
			let cartItem = getCartItem(photo.id);
			return {
				price_data: {
					currency: 'usd',
					product_data: {
						name: photo.name,
						description: photo.description,
						images: [photo.url]
					},
					unit_amount: photo.price * 100
				},
				quantity: cartItem.qty
			}
		}),
		success_url: successURL,
		cancel_url: currentURL
	}

	// If already submitting, ignore click
	if (submitting) return;

	// Update status
	status[0] = 'Redirecting to checkout...';
	submitting = true;

	try {
		// Call the API
		let sessionRequest = await fetch(stripeURL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(stripeData)
		});

		// If there's a problem, throw an error
		if (!sessionRequest.ok) throw sessionRequest;

		// Get the session data
		let session = await sessionRequest.json();
		console.log(session);

		// Redirect to Stripe Checkout
		window.location.href = session.url;

	} catch (error) {
		console.warn(error);
		status[0] = 'Unable to checkout. Please try again.';
		submitting = false;
	}
}

function increaseCartItemQuantityClickHandler (event) {
	let btn = event.target.closest('[data-increase-item-qty]');
	if (!btn) return;
	let id = btn.getAttribute('data-increase-item-qty');
	if (!id) return;
	increaseCartItemQuantity(id);
	let photo = getPhotoByID(id, photos);
	let cartItem = getCartItem(id);
	let msg = `1 "${photo.name}" added to your cart. New Quantity: ${cartItem.qty}`;
	status.push(msg);
	setTimeout(function () {
		status.splice(status.indexOf(msg), 1);
	}, 3000);
}

function decreaseCartItemQuantityClickHandler (event) {
	let btn = event.target.closest('[data-decrease-item-qty]');
	if (!btn) return;
	let id = btn.getAttribute('data-decrease-item-qty');
	if (!id) return;
	decreaseCartItemQuantity(id);
	let photo = getPhotoByID(id, photos);
	let cartItem = getCartItem(id);
	let msg = `1 "${photo.name}" removed from your cart. New Quantity: ${cartItem.qty}`;
	status.push(msg);
	setTimeout(function () {
		status.splice(status.indexOf(msg), 1);
	}, 3000);
}

function deleteCartItemClickHandler (event) {
	let btn = event.target.closest('[data-delete-item]');
	if (!btn) return;
	let id = btn.getAttribute('data-delete-item');
	if (!id) return;
	deleteCartItem(id);
	let photo = getPhotoByID(id, photos);
	let msg = `"${photo.name}" deleted from cart.`;
	status.push(msg);
	setTimeout(function () {
		status.splice(status.indexOf(msg), 1);
	}, 3000);
}

function emptyCartClickHandler (event) {
	let btn = event.target.closest('[data-empty-cart]');
	if (!btn) return;
	emptyCart();
	let msg = `Cart emptied.`;
	status.push(msg);
	setTimeout(function () {
		status.splice(status.indexOf(msg), 1);
	}, 3000);
}

fetchPhotos().then(function (data) {
	photos = data;
	let app = document.querySelector('[data-app]');
	if (app) component(app, getCartHTML);
	document.addEventListener('click', function (event) {
		increaseCartItemQuantityClickHandler(event);
		decreaseCartItemQuantityClickHandler(event);
		deleteCartItemClickHandler(event);
		emptyCartClickHandler(event);
		checkoutClickHandler(event);
	});
});

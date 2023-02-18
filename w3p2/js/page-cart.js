import {component, store} from '../../js/vendor/reef.es.js';
import {fetchPhotos, getPhotoByID} from './components/photos.js';
import {
	// getCartDetails,
	increaseCartItemQuantity,
	decreaseCartItemQuantity,
	deleteCartItem,
	emptyCart,
	getCartItem
} from './components/cart.js';

let photos = [],
	status = store([]);

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
	<button data-empty-cart>Empty Cart</button>
	<p aria-live="polite">${status.join('<br>')}</p>
	`;
	return html;
}

function increaseCartItemQuantityClickHandler (event) {
	let btn = event.target.closest('[data-increase-item-qty]');
	if (!btn) return;
	let id = btn.getAttribute('data-increase-item-qty');
	if (!id) return;
	increaseCartItemQuantity(id);
	let photo = getPhotoByID(id, photos);
	let msg = `1 "${photo.name}" added to your cart.`;
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
	let msg = `1 "${photo.name}" removed from your cart.`;
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
	});
});

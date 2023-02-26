import {
	emptyCart,
	getCartDataFromURL,
	getCartItem
} from './components/cart.js';
import {fetchPhotos} from './components/photos.js';
import {render} from '../../js/vendor/reef.es.js';

emptyCart();
let photos = [],
	urlCartItems = getCartDataFromURL();

function getCartHTML () {
	let photosInCart = photos.filter(function (photo) {
		return getCartItem(photo.id, urlCartItems);
	});

	// If there are no items in the cart
	if (!photosInCart.length) {
		return `
		<div aria-live="polite">${status.join('<br>')}</div>
		<p>No items in cart.</p>
		`;
	}
	console.log(photosInCart);

	let cartTotalPrice = 0,
		cartTotalQty = 0;
	let html = `
	<h3>Order Summary</h3>
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
		let item = getCartItem(photo.id, urlCartItems);
		console.log(item);
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
	`;
	return html;
}

fetchPhotos().then(function (data) {
	photos = data;
	let app = document.querySelector('[data-app]');
	if (app) render(app, getCartHTML());
});



import {render} from '../../js/vendor/reef.es.js';
import {fetchPhotos} from './components/fetch-photos.js';
import {getCartDetails} from './components/cart.js';

function getCartHTML (photos) {
	let items = getCartDetails(photos);
	if (!items.length) return '<p>No items in cart.</p>';

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
	for (let item of items) {
		let rowPrice = item.photo.price * item.qty;
		cartTotalPrice += rowPrice;
		cartTotalQty += item.qty;
		html += `
		<tr>
			<td class="item-thumb"><img alt="${item.photo.description}" src="${item.photo.url}"></td>
			<td class="item-name"><strong>${item.photo.name}</strong></td>
			<td class="item-cost-per-unit">${item.photo.price}</td>
			<td class="item-qty">${item.qty}</td>
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

fetchPhotos().then(function (photos) {
	let app = document.querySelector('[data-app]');
	if (app) render(app, getCartHTML(photos));
});

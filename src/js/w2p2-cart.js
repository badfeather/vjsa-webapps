import {store, component} from './vendor/reef.es.js';
import {getCartData} from './components/cart.js';

let cartItems = store(getCartData());

function getCartHTML () {
	if (!cartItems.length) return '<p>No items in cart.</p>';

	let cartTotalPrice = 0,
		cartTotalQty = 0;
	let html = `
	<table class="cart">
		<tr>
			<th>Photo</th>
			<th>Cost per unit</th>
			<th>Quantity</th>
			<th>Price</th>
		</tr>
	`;
	for (let item of cartItems) {
		let rowPrice = item.photo.price * item.qty;
		cartTotalPrice += rowPrice;
		cartTotalQty += item.qty;
		html += `
		<tr>
			<td class="item-name"><strong>${item.photo.name}</strong></td>
			<td class="item-cost-per-unit">${item.photo.price}</td>
			<td class="item-qty">${item.qty}</td>
			<td class="item-price">$${rowPrice}</td>
		</tr>
		`;
	}
	html += `
		<tr class="cart-totals">
			<td colspan="2"><strong>TOTAL</strong></td>
			<td class="total-qty">${cartTotalQty} Items</td>
			<td class="cart-total">$${cartTotalPrice}</td>
		</tr>
	</table>
	`;
	return html;
}

let app = document.querySelector('[data-app]');
if (app) component(app, getCartHTML);


import {store, component} from 'https://cdn.jsdelivr.net/npm/reefjs@12/dist/reef.es.min.js';

let cartItems = store(JSON.parse(localStorage.getItem('cartItems')) || []);

/**
 * Save cart to session storage
 * @param  {Array} cartData The photo data
 */
function addToCart (photo, qty = 1) {
	let match = cartItems.find(function(item) {
		return cartItems.photo.id === item.id;
	});
	if (match) {
		let newQty = match.qty + qty;
		match.qty = newQty;

	} else {
		cartItems.push({
			"photo": photo,
			"qty": qty
		});
	}
	localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function getCartHTML () {
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
			<td class="total-qty>${cartTotalQty} Items</td>
			<td class="cart-total">$${cartTotalPrice}</td>
		</tr>
	</table>
	`;
	return html;
}

let cart = document.querySelector('[data-cart]');
if (cart) component(cart, getCartHTML);

export {addToCart};


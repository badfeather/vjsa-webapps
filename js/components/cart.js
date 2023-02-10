import {store, component} from '../vendor/reef.es.js';

/**
 * Get saved cart data from session storage
 * @return {Array} The cart data
 */
function getCartData () {
	return JSON.parse(localStorage.getItem('cartItems')) || [];
}

/**
 * Save cart to session storage
 * @param  {Array} cartData The photo data
 */
function addToCart (photo, qty = 1, items = getCartData()) {
	items = items ? items : [];
	let match = items.find(function(item) {
		return item.photo.id === photo.id;
	});
	if (match) {
		let newQty = match.qty + qty;
		match.qty = newQty;

	} else {
		items.push({
			"photo": photo,
			"qty": qty
		});
	}
	localStorage.setItem('cartItems', JSON.stringify(items));
}

let cartData = store(getCartData());

function getCartCountHTML () {
	let total = 0;
	if (!cartData.length) return total;
	for (let item of cartData) {
		console.log(item.qty);
		total += item.qty;
	}
	return total;
}

let count = document.querySelector('[data-cart-count]');
if (count) component(count, getCartCountHTML);

export {addToCart, getCartData};


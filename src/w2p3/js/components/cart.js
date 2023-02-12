import {store, component} from '../../../js/vendor/reef.es.js';

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
function addToCart (id, qty = 1) {
	let match = cartData.find(function(item) {
		return item.id === id;
	});
	if (match) {
		match.qty = match.qty + qty;

	} else {
		cartData.push({
			"id": id,
			"qty": qty
		});
	}
	localStorage.setItem('cartItems', JSON.stringify(cartData));
}

function getCartDetails (photos) {
	if (!photos.length) return '<p>Error retrieving photo data</p>';
	let details = [];
	for (let item of cartData) {
		let detail = item;
		let match = photos.find(function(photo) {
			return detail.id === photo.id;
		});
		if (!match) continue;
		detail.photo = match;
		details.push(detail);
	}
	console.log(details);
	return details;
}

let cartData = store(getCartData());

function getCartCountHTML () {
	let total = 0;
	if (!cartData.length) return total;
	for (let item of cartData) {
		total += item.qty;
	}
	console.log('new total: ' + total);
	return total;
}

let count = document.querySelector('[data-cart-count]');
if (count) component(count, getCartCountHTML);

export {addToCart, getCartData, getCartDetails};


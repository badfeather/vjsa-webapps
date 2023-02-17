import {store, component} from '../../../js/vendor/reef.es.js';

let storageKey = 'w2p3CartItems';

/**
 * Get saved cart data from session storage
 * @return {Array} The cart data
 */
function getCartData () {
	return JSON.parse(localStorage.getItem(storageKey)) || [];
}

function getCartItem (id) {
	return cartData.find(function(item) {
		return item.id === id;
	});
}

/**
 * Save cart to session storage
 * @param  {Array} cartData The photo data
 */
function increaseCartItemQuantity (id, qty = 1) {
	let match = getCartItem(id);
	if (match) {
		match.qty = match.qty + qty;

	} else {
		cartData.push({
			"id": id,
			"qty": qty
		});
	}
	localStorage.setItem(storageKey, JSON.stringify(cartData));
}

function decreaseCartItemQuantity (id, qty = 1) {
	let match = getCartItem(id);
	if (!match) return;
	let newQty = match.qty - qty;
	if (newQty <= 0) deleteCartItem(id);
	match.qty = newQty;
	localStorage.setItem(storageKey, JSON.stringify(cartData));
}

function deleteCartItem (id) {
	cartData = cartData.filter(function(item) {
		return item.id !== id;
	});
	localStorage.setItem(storageKey, JSON.stringify(cartData));
}

function emptyCart () {
	cartData = [];
	localStorage.setItem(storageKey, JSON.stringify(cartData));
}

function getCartDetails (photos) {
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

export {increaseCartItemQuantity, decreaseCartItemQuantity, deleteCartItem, emptyCart, getCartDetails, getCartItem};


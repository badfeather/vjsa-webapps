import {store, component} from '../../../js/vendor/reef.es.js';
let storageKey = 'w5p3CartItems';

/**
 * Get saved cart data from session storage
 * @return {Array} The cart data
 */
function getCartData () {
	return JSON.parse(localStorage.getItem(storageKey)) || [];
}

function getCartItem (id, data = cartData) {
	return data.find(function(item) {
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

function getCartCountHTML () {
	let total = 0;
	if (!cartData.length) return total;
	for (let item of cartData) {
		total += item.qty;
	}
	console.log('new total: ' + total);
	return total;
}

function getCartQueryString() {
	if (!cartData.length) return '';
	let str = [];
	for (let item of cartData) {
		let key = 'cid_' + item.id;
		str.push(`${encodeURIComponent(key)}=${encodeURIComponent(item.qty)}`);
	}
	return '?' + str.join('&');
}

/**
 * Get cart data from the URL
 * @return {Object} Cart data
 */
function getCartDataFromURL () {
	let params = new URL(window.location.href).searchParams;
	let data = [];
	for (let [key, val] of params) {
		if (!key.includes('cid_')) continue;
		let id = key.replace('cid_', '');
		data.push({
			"id": id,
			"qty": parseInt(val)
		});
	}
	return data;
}

/**
 * Restore the cart
 */
function restoreCartDataFromURL () {
	let data = getCartDataFromURL();
	console.log(data);
	if (!data.length) return;

	// Empty the current cart data, if any
	emptyCart();

	// Save to local storage
	localStorage.setItem(storageKey, JSON.stringify(data));

	// Update the URL
	let url = new URL(window.location.href);
	for (let item of data) {
		url.searchParams.delete(`cid_${item.id}`);
	}
	history.replaceState(history.state, '', url);
}

let cartData = store(getCartData());
let count = document.querySelector('[data-cart-count]');
if (count) component(count, getCartCountHTML);

export {
	increaseCartItemQuantity,
	decreaseCartItemQuantity,
	deleteCartItem,
	emptyCart,
	getCartData,
	getCartItem,
	getCartQueryString,
	getCartDataFromURL,
	restoreCartDataFromURL
};


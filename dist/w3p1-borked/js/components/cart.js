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
function addToCart (id, qty = 1) {
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

function getAdjustQuanityHTML (id, max = 10) {
	let match = getCartItem(id);
	if (!match) return '';
	let qty = match.qty;
	let html = `
	<div class="adjust-item-quantity">
		<select data-adjust-cart-item-quantity="${id}">
			<option value="0">0 (delete)</option>
	`;
	for (let i = 1; i <= max; i++) {
		let selected = i === qty ? ' selected' : '';
		html += `<option value="${i}"${selected}>${i}</option>`;
	}
	html += `
		</select>
		<button data-delete-cart-item="${id}">Delete</button>
	</div>
	`;
	return html;
}

function adjustCartItemQuantityChangeHandler (event) {
	let select = event.target.closest('[data-adjust-cart-item-quantity]');
	if (!select) return;
	let id = select.getAttribute('data-adjust-cart-item-quantity');
	if (!id) return;
	let match = getCartItem(id);
	let qty = select.value;
	if (qty === 0) {
		deleteCartItem(id);
		return;
	}
	match.qty = qty;
	localStorage.setItem(storageKey, JSON.stringify(cartData));
}

function deleteFromCartClickHandler (event) {
	let btn = event.target.closest('[data-delete-cart-item]');
	if (!btn) return;
	let id = btn.getAttribute('data-delete-cart-item');
	if (!id) return;
	deleteCartItem(id);
}

function getCartDetails (photos) {
	let details = [];
	for (let item of cartData) {
		let match = photos.find(function(photo) {
			return item.id === photo.id;
		});
		if (!match) continue;
		let detail = item;
		detail.photo = match;
		details.push(detail);
	}
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

export {
	getCartItem,
	addToCart,
	deleteCartItem,
	emptyCart,
	getAdjustQuanityHTML,
	adjustCartItemQuantityChangeHandler,
	deleteFromCartClickHandler,
	getCartDetails
};


let storageKey = 'w2p1CartItems';

/**
 * Get saved cart data from session storage
 * @return {Array} The cart data
 */
function getCartData () {
	return JSON.parse(localStorage.getItem(storageKey)) || [];
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
	localStorage.setItem(storageKey, JSON.stringify(items));
}

export {addToCart, getCartData};


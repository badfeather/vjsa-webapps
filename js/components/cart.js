/**
 * Get saved cart data from session storage
 * @return {Array} The cart data
 */
function getCartItems () {
	return JSON.parse(localStorage.getItem('cartItems'));
}

/**
 * Save cart to session storage
 * @param  {Array} cartData The photo data
 */
function addToCart (photo, qty = 1) {
	let items = getCartItems();
	items = items ? items : [];
	console.log(items);
	let match = items.find(function(item) {
		return item.photo.id === photo.id;
	});
	console.log(match);
	if (match) {
		let newQty = match.qty + qty;
		match.qty = newQty;
		match.totalPrice = newQty * photo.price;

	} else {
		items.push({
			"photo": photo,
			"qty": qty,
			"totalPrice": qty * photo.price
		});
	}
	localStorage.setItem('cartItems', JSON.stringify(items));
}

export {addToCart, getCartItems};


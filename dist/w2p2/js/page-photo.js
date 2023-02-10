import {store, component} from '../../js/vendor/reef.es.js';
import {fetchPhotos} from './components/fetch-photos.js';
import {addToCart, getCartData} from './components/cart.js';

let photos = [];

function getPhotoID () {
	return new URL(window.location.href).searchParams.get('id');
}

function getPhotoByID (photos, id) {
	return photos.find(function (photo) {
		return photo.id === id;
	});
}

function getErrorHTML () {
	return `<p>This photo is missing.</p>`;
}

function getPhotoHTML () {
	let id = getPhotoID();
	if (!id) return getErrorHTML();
	let photo = getPhotoByID(photos, id);
	if (!photo) return getErrorHTML();
	document.title = `${photo.name} | ${document.title}`;
	return `
<article id="${photo.id}" class="single">
	<figure class="photo-figure">
		<img src="${photo.url}" alt="${photo.description}" />
	</figure>
	<header>
		<h2>${photo.name}</h2>
		<p class="photo-description">${photo.description}</p>
		<p class="photo-price">$${photo.price}</p>
		<p><button data-add-to-cart="${photo.id}">Add to cart</button></p>
	</header>
</article>
	`;
}

function addToCartClickHandler (event) {
	let btn = event.target.closest('[data-add-to-cart]');
	if (!btn) return;
	let id = btn.getAttribute('data-add-to-cart');
	if (!id) return;
	let photo = photos.find(function(photo) {
		return photo.id === id;
	});
	addToCart(photo);
}

fetchPhotos().then(function (data) {
	photos = data;
	let app = document.querySelector('[data-app]');
	if (!photos.length || !app) return;
	component(app, getPhotoHTML);

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
	document.addEventListener('click', addToCartClickHandler);
});

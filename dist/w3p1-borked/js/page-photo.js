import {component} from '../../js/vendor/reef.es.js';
import {fetchPhotos} from './components/fetch-photos.js';
import {
	addToCart,
	getCartItem,
	getAdjustQuanityHTML,
	adjustCartItemQuantityChangeHandler,
	deleteFromCartClickHandler
} from './components/cart.js';

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

function addToCartClickHandler (event) {
	let btn = event.target.closest('[data-add-to-cart]');
	if (!btn) return;
	let id = btn.getAttribute('data-add-to-cart');
	if (!id) return;
	addToCart(id);
	let item = getCartItem(id);
	let photo = getPhotoByID(photos, id);
	let msg = document.querySelector('[data-cart-item-update-msg="id"]');
	if (item && msg && photo) {
		msg.textContent = `${photo.title} added to cart`;
		msg.setTimeout(function () {
			msg.textContent = '';
		}, 4000);
	}
}

function getPhotoHTML () {
	let id = getPhotoID();
	if (!id) return getErrorHTML();
	let photo = getPhotoByID(photos, id);
	if (!photo) return getErrorHTML();
	let adjuster = getAdjustQuanityHTML(id);
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
		<p><div data-cart-item-update-msg="${photo.id}" aria-live="polite"></div></p>
		${adjuster}
	</header>
</article>
	`;
}

fetchPhotos().then(function (data) {
	photos = data;
	let app = document.querySelector('[data-app]');
	if (!photos.length || !app) return;
	component(app, getPhotoHTML);
	document.addEventListener('change', adjustCartItemQuantityChangeHandler);
	document.addEventListener('click', function (event) {
		deleteFromCartClickHandler(event);
		addToCartClickHandler(event);
	});
});

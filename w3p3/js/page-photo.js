import {component, store} from '../../js/vendor/reef.es.js';
import {fetchPhotos, getPhotoByID} from './components/photos.js';
import {increaseCartItemQuantity, getCartItem} from './components/cart.js';

let photos = [],
	status = store([]);

function getPhotoID () {
	return new URL(window.location.href).searchParams.get('id');
}

function getErrorHTML () {
	return `<p>This photo is missing.</p>`;
}

function getPhotoHTML () {
	let id = getPhotoID();
	if (!id) return getErrorHTML();
	let photo = getPhotoByID(id, photos);
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
		<p><button data-increase-item-qty="${photo.id}">Add to cart</button></p>
	</header>
</article>
<p aria-live="polite">${status.join('<br>')}</p>
	`;
}

function increaseCartItemQuantityClickHandler (event) {
	console.log(photos);
	let btn = event.target.closest('[data-increase-item-qty]');
	if (!btn) return;
	let id = btn.getAttribute('data-increase-item-qty');
	if (!id) return;
	increaseCartItemQuantity(id);
	let photo = getPhotoByID(id, photos);
	let cartItem = getCartItem(id);
	let msg = `1 "${photo.name}" added to your cart. Total: ${cartItem.qty}`;
	status.push(msg);
	setTimeout(function () {
		status.splice(status.indexOf(msg), 1);
	}, 3000);
}

fetchPhotos().then(function (data) {
	photos = data;
	let app = document.querySelector('[data-app]');
	if (!photos.length || !app) return;
	component(app, getPhotoHTML);
	document.addEventListener('click', function(event) {
		increaseCartItemQuantityClickHandler(event);
	});
});

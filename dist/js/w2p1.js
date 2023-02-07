import {render} from './vendor/reef.es.js';
import fetchPhotos from './components/fetch-photos.js';
import {getCartItems, addToCart} from './components/cart.js';

function getPhotoHTML (photo, type) {
	type = ['card', 'single'].includes(type) ? type : 'card';
	let header = '',
		href = '',
		before = '',
		after = '',
		urlObj = new URL(window.location.href);

	if (type === 'single') {
		urlObj.search = '';
		document.title = `${photo.name} | ${document.title}`;
		href = urlObj.toString();
		before = `<p><a href="${href}" class="btn" btn--all">All Photos</a></p>`;
		header = `
<header class="${type}-header">
	<h2 class="${type}-title">${photo.name}</h2>
	<div class="${type}-description">${photo.description}</h2>
	<div class="${type}-price">$${photo.price}</div>
	<button data-add-to-cart="${photo.id}">Add to cart</button>
</header>
		`;
	}

	if (type === 'card') {
		urlObj.search = '';
		let params = urlObj.searchParams;
		params.set('id', photo.id);
		urlObj.search = params;
		href = urlObj.toString();
		before = `<a href="${href}">`;
		after = '</a>';
	}

	return `
${before}
<article id="${photo.id}" class="${type}">
	<figure class="card-figure">
		<img src="${photo.url}" alt="${photo.description}" />
	</figure>
	${header}
</article>
${after}
	`;
}

function getPhotosHTML (photos) {
	if (!photos.length) return '<p>Error retrieving photos.</p>';
	let html = '';
	let id = new URL(window.location.href).searchParams.get('id');
	let photo;
	if (id) {
		photo = photos.find(function(photo) {
			return photo.id === id;
		});
		if (photo) return getPhotoHTML(photo, 'single');
	}

	html += '<div id="photos" class="cards photos">';
	for (let photo of photos) {
		html += getPhotoHTML(photo, 'card');
	}
	html += '</div>';
	return html;
}

function getCartHTML (items) {
	if (!items || !items.length) return '<p>Cart is empty</p>';
	let html = '<h2>Cart</h2>';
	html += '<table class="cart">';
	let total = 0;
	for (let item of items) {
		let photo = item.photo;
		total += item.totalPrice;
		html += `
		<tr>
			<td item-id="${item.id}"><strong>${photo.name}</strong></td>
			<td class="item-qty">${item.qty}</td>
			<td class="item-price">$${item.totalPrice}</td>
		</tr>
		`;
	}
	html += `
	<tr>
		<td colspan="2"><strong>TOTAL</strong></td>
		<td class="cart-total">$${total}</td>
	</tr>
	`;
	html += '</table>';
	return html;
}

let app = document.querySelector('[data-app]');
let cart = document.querySelector('[data-cart]');
if (app && cart) {
	fetchPhotos('https://vanillajsacademy.com/api/photos.json').then(function (photos) {
		render(app, getPhotosHTML(photos));
		render(cart, getCartHTML(getCartItems(), photos));

		document.addEventListener('click', function (event) {
			let btn = event.target.closest('[data-add-to-cart]');
			if (!btn) return;
			let id = btn.getAttribute('data-add-to-cart');
			if (!id) return;
			let photo = photos.find(function(photo) {
				return photo.id === id;
			});
			addToCart(photo);
			// cart.innerHTML = getCartHTML(getCartItems());
			render(cart, getCartHTML(getCartItems()));
		});
	});
}




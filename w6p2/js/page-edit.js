import {component, store} from '../../js/vendor/reef.es.js';
import {getToken} from './components/token.js';
import {dashURL} from './components/endpoints.js';
import {getPhotoByID} from './components/photos.js';
import {serialize, sanitizeHTML} from './components/helpers.js';
import {fetchAuthPhotos} from './components/dashboard.js';
import './components/logout.js';

let photos = [],
	photo,
	token = getToken(),
	formStatus = store('');

function getEditHTML () {
	if (!photo) {
		formStatus.value = 'Error retrieving photo.';
		return;
	}
	let {id, name, url, description, price} = photo;
	console.log
	let html = `
	<form data-edit-photo="${id}">
		<p>
		<label for="url">Photo URL</label>
		<input type="url" name="url" id="url" #value="${url}" required>
		</p>

		<p>
		<label for="name">Title</label>
		<input type="text" name="name" id="name" #value="${name}" required>
		</p>

		<p>
		<label for="description">Description</label>
		<input type="text" name="description" id="description" #value="${description}" required>
		</p>

		<p>
		<label for="price">Price (in dollars)</label>
		<input type="text" name="price" id="price" #value="${price}" required>
		</p>

		<p><button>Update photo</button></p>

		<p role="status">${formStatus.value}</p>
	</form>
	`;
	return html;
}

async function submitHandler (event) {
	let form = event.target.closest('[data-edit-photo]');
	if (!form) return;
	event.preventDefault();
	if (form.hasAttribute('data-submitting')) return;
	let formData = serialize(new FormData(form));
	console.log(formData);
	let {url, name, description, price} = formData;
	if (!url || !name || !description || !price) formStatus.value = 'Please provide a url, name, description, and price.';
	if (Number.isNaN(parseFloat(price))) {
		formStatus.value = 'Price must be a valid number';
		return;
	}
	url = sanitizeHTML(url);
	name = sanitizeHTML(name);
	description = sanitizeHTML(description);
	price = sanitizeHTML(price);

	if (photo.url !== url) photo.url = url;
	if (photo.name !== name) photo.name = name;
	if (photo.description !== description) photo.description = description;
	if (photo.price !== price) photo.price = price;

	console.log(photo);

	form.setAttribute('data-submitting', true);

	try {
		let response = await fetch(`${dashURL}?token=${token}`, {
			method: 'PUT',
			body: JSON.stringify(photo),
			headers: {
				'Content-type': 'application/json',
				'Authorization': `Bearer ${token}`,
			}
		});

		if (!response.ok) throw response;
		let msg = await response.text();
		formStatus.value = msg;

	} catch (error) {
		form.removeAttribute('data-submitting');
		console.log(error);
		formStatus.value = 'Something went wrong. Please try again.';
	}
}

fetchAuthPhotos().then(function (data) {
	let app = document.querySelector('[data-app]');
	let id = new URL(window.location.href).searchParams.get('id');
	if (!app || !id) return;
	photos = data;
	photo = getPhotoByID(id, photos);
	component(app, getEditHTML);
	document.addEventListener('submit', submitHandler);
});


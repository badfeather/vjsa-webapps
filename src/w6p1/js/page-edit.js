import {component, store} from '../../js/vendor/reef.es.js';
import {getToken} from './components/token.js';
import {dashURL} from './components/endpoints.js';
import {getPhotoByID} from './components/photos.js';
import {serialize} from './components/helpers.js';
import {fetchAuthPhotos} from './components/dashboard.js';
import {sanitizeHTML} from './components/helpers.js';
import './components/logout.js';

let photos = [],
	token = getToken(),
	photo,
	status;

function getEditHTML () {
	if (!photo.length)  '<p>Error retrieving photo.</p>';
	let {id, name, url, description, price} = photo;
	console.log
	let html = `
	<form data-edit-photo="${id}">
		<p>
		<label for="url">Photo URL</label>
		<input type="url" name="url" id="url" value="${url}" required>
		</p>

		<p>
		<label for="name">Title</label>
		<input type="text" name="name" id="name" value="${name}" required>
		</p>

		<p>
		<label for="description">Description</label>
		<input type="text" name="description" id="description" value="${description}" required>
		</p>

		<p>
		<label for="price">Price (in dollars)</label>
		<input type="text" name="price" id="price" value="${price}" required>
		</p>

		<p><button>Update</button></p>
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
		console.log(msg);
		status.innerText = `Photo updated.`;

	} catch (error) {
		form.removeAttribute('data-submitting');
		console.log(error);
		status.innerText = 'Something went wrong. Please try again.';
	}
}

fetchAuthPhotos().then(function (data) {
	let app = document.querySelector('[data-app]');
	status = document.querySelector('[data-form-status]');
	let id = new URL(window.location.href).searchParams.get('id');
	if (!app || !status || !id) return;
	photos = store(data);
	photo = getPhotoByID(id, photos);
	if (!photo) return;
	component(app, getEditHTML);
	document.addEventListener('submit', submitHandler);
});


import {component, store} from '../../js/vendor/reef.es.js';
import {getToken} from './components/token.js';
import {dashURL} from './components/endpoints.js';
import {getPhotoByID} from './components/photos.js';
import {serialize} from './components/helpers.js';
import {fetchAuthPhotos} from './components/dashboard.js';
import './components/logout.js';

let photos = [],
	token = getToken(),
	photo;

function getEditHTML () {
	if (!photo.length)  '<p>Error retrieving photo.</p>';
	let {id, name, url, description, price} = photo;
	let html = `
	<form data-edit-photo="${id}">
		<p>
		<label for="photo_id">Photo ID (lowercase with dashes)</label>
		<input type="text" name="photo_id" id="photo_id" value="${id}" required>
		</p>

		<p>
		<label for="photo_url">Photo URL</label>
		<input type="url" name="photo_url" id="photo_url" value="${url}" equired>
		</p>

		<p>
		<label for="photo_name">Title</label>
		<input type="text" name="photo_name" id="photo_name" value="${name}" required>
		</p>

		<p>
		<label for="photo_description">Description</label>
		<input type="text" description="photo_description" id="photo_description" value="${description}" required>
		</p>

		<p>
		<label for="photo_price">Price (in dollars)</label>
		<input type="text" price="photo_price" id="photo_price" value="${price}" required>
		</p>

		<p><button>Update</button></p>

		<div data-form-status role="status" aria-live="polite"></div>
	</form>
	`;
	return html;
}

async function submitHandler (event) {
	let form = event.target.closest('[data-edit-photo]');
	if (!form) return;
	event.preventDefault();
	let status = form.querySelector('[data-form-status]');
	if (form.hasAttribute('data-submitting')) return;
	let {photo_id, photo_url, photo_name, photo_description, photo_price} = serialize(new FormData(form));

	let match = getPhotoByID(photo_id, photos);
	if (match.id !== photo_id) match.id = photo_id;
	if (match.url !== photo_url) match.url = photo_url;
	if (match.name !== photo_name) match.name = photo_name;
	if (match.description !== photo_description) match.description = photo_description;
	if (match.price !== photo_price) match.price = photo_price;

	form.setAttribute('data-submitting', true);

	try {
		let response = await fetch(`${dashURL}?token=${token}`, {
			method: 'PUT',
			body: JSON.stringify(match),
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
		status.innerText = 'Something went wrong. Please try again.';
	}
}

fetchAuthPhotos().then(function (data) {
	let app = document.querySelector('[data-app]');
	let id = new URL(window.location.href).searchParams.get('id');
	if (!app || !id) return;
	photos = store(data);
	photo = getPhotoByID(id, photos);
	if (!photo) return;

	component(app, getEditHTML);
	document.addEventListener('submit', submitHandler);
});


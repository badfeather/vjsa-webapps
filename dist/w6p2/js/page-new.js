import {component, store} from '../../js/vendor/reef.es.js';
import {getToken} from './components/token.js';
import {dashURL} from './components/endpoints.js';
// import {getPhotoByID} from './components/photos.js';
import {serialize, getNewURLPath, getCleanURL} from './components/helpers.js';
// import {fetchAuthPhotos} from './components/dashboard.js';
import {sanitizeHTML} from './components/helpers.js';
import './components/logout.js';

let token = getToken(),
	photo = {},
	formStatus = store('');

function getNewHTML () {
	let html = `
	<form data-edit-photo>
		<p>
		<label for="url">Photo URL</label>
		<input type="url" name="url" id="url" required>
		</p>

		<p>
		<label for="name">Title</label>
		<input type="text" name="name" id="name" required>
		</p>

		<p>
		<label for="description">Description</label>
		<input type="text" name="description" id="description" required>
		</p>

		<p>
		<label for="price">Price (in dollars)</label>
		<input type="text" name="price" id="price" required>
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
	name = sanitizeHTML(name);
	let id = name.replace(/\s+/g, '-').toLowerCase();

	photo.id = id;
	photo.url = sanitizeHTML(url);
	photo.name = name;
	photo.description = sanitizeHTML(description);
	photo.price = sanitizeHTML(price);

	console.log(photo);

	form.setAttribute('data-submitting', true);

	try {
		let response = await fetch(`${dashURL}?token=${token}`, {
			method: 'POST',
			body: JSON.stringify(photo),
			headers: {
				'Content-type': 'application/json',
				'Authorization': `Bearer ${token}`,
			}
		});

		if (!response.ok) throw response;
		let msg = await response.text();
		formStatus.value = msg;
		// redirect to edit
		window.location.href = `${getNewURLPath('edit', getCleanURL())}?id=${encodeURIComponent(id)}`;


	} catch (error) {
		form.removeAttribute('data-submitting');
		console.log(error);
		formStatus.value = 'Something went wrong. Please try again.';
	}
}

let app = document.querySelector('[data-app]');
if (app) {
	console.log('here');
	component(app, getNewHTML);
	document.addEventListener('submit', submitHandler);
}


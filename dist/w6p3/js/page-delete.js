import {component, store} from '../../js/vendor/reef.es.js';
import {getToken} from './components/token.js';
import {dashURL} from './components/endpoints.js';
import {getCleanURL} from './components/helpers.js';
import {getPhotoByID} from './components/photos.js';
// import {serialize, sanitizeHTML} from './components/helpers.js';
import {fetchAuthPhotos} from './components/dashboard.js';
import './components/logout.js';

let photos = [],
	id,
	deleted,
	photo,
	token = getToken(),
	formStatus = store('');

function getEditHTML () {
	if (deleted) return '';
	if (!photo) {
		formStatus.value = 'Error retrieving photo.';
		return;
	}
	let name = photo.name;
	let html = `
	<p>Confirm you want to delete the photo "${name}" using the form below.</p>

	<form data-delete-photo="${id}">
		<p>
		<label for="delete_photo">Confirm deletion</label>
		<input type="checkbox" id="delete_photo" name="delete_photo" value="${id}">
		</p>

		<p><button>Delete photo</button></p>
	</form>
	<p role="status">${formStatus.value}</p>
	`;
	return html;
}

async function submitHandler (event) {
	let form = event.target.closest('[data-delete-photo]');
	if (!form || !id) return;
	event.preventDefault();
	if (form.hasAttribute('data-submitting')) return;
	let checkbox = document.getElementById('delete_photo');
	if (!checkbox) return;
	if (!checkbox.checked) formStatus.value = 'Please confirm the deletion using the checkbox.';
	form.setAttribute('data-submitting', true);

	try {
		let response = await fetch(`${dashURL}?token=${token}`, {
			method: 'DELETE',
			body: id,
			headers: {
				'Content-type': 'application/text',
				'Authorization': `Bearer ${token}`,
			}
		});

		if (!response.ok) throw response;
		let msg = await response.text();
		formStatus.value = msg;
		window.location.href = `${getCleanURL()}?delete_photo=${encodeURIComponent(id)}`;

	} catch (error) {
		form.removeAttribute('data-submitting');
		console.log(error);
		formStatus.value = 'Something went wrong. Please try again.';
	}
}

fetchAuthPhotos().then(function (data) {
	let app = document.querySelector('[data-app]');
	let params = new URL(window.location.href).searchParams;
	deleted = params.get('delete_photo');
	id = deleted ? deleted : params.get('id');
	if (!app || !id) return;
	photos = data;
	photo = getPhotoByID(id, photos);
	console.log(getCleanURL());
	let title = document.querySelector('[data-title]');
	if (title) {
		if (deleted) {
			title.innerText = `Photo with id '${id}' deleted`;
		} else if (photo) {
			title.innerText = `Delete photo '${photo.name}'`;
		}
	}
	component(app, getEditHTML);
	document.addEventListener('submit', submitHandler);
});


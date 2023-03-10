import {component, store} from '../../js/vendor/reef.es.js';
import {getToken} from './components/token.js';
import {dashURL} from './components/endpoints.js';
import {getPhotoByID} from './components/photos.js';
// import {serialize, sanitizeHTML} from './components/helpers.js';
import {fetchAuthPhotos} from './components/dashboard.js';
import './components/logout.js';

let photos = [],
	photo,
	token = getToken(),
	formStatus = store(''),
	id,
	name;

function getEditHTML () {
	if (!photo) {
		formStatus.value = '<p>Error retrieving photo.</p>';
		return;
	}
	let html = `
	<p>Confirm you want to delete the photo "${name}" using the form below.</p>

	<form data-delete-photo="${id}">
		<p>
		<label for="delete_photo">Confirm deletion</label>
		<input type="checkbox" id="delete_photo" name="delete_photo">
		</p>

		<p><button>Delete photo</button></p>

		<p role="status">${formStatus.value}</p>
	</form>
	`;
	return html;
}

async function submitHandler (event) {
	let form = event.target.closest('[data-delete-photo]');
	if (!form || !id) return;
	event.preventDefault();
	if (form.hasAttribute('data-submitting')) return;
	let checkbox = form.getElementByID('delete_photo');
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
	if (photo) {
		id = photo.id;
		name = photo.name;
	}
	component(app, getEditHTML);
	document.addEventListener('submit', submitHandler);
});


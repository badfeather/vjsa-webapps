import {component, store} from '../../js/vendor/reef.es.js';
import {getToken, removeToken} from './components/token.js';
import {getNewURLPath} from './components/helpers.js';
import {authURL} from './components/endpoints.js';
import {fetchAuthPhotos} from './components/admin.js';

let photos = [],
	token = getToken();

console.log('Token: ' + token);
if (!token) window.location.href = getNewURLPath('login');

async function logoutClickHandler (event) {
	let link = event.target.closest('[data-loginout="logout"]');
	if (!link) return;
	event.preventDefault();
	link.textContent = 'Logging out...';

	try {
		let response = await fetch(authURL, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (!response.ok) throw response;
		removeToken();
		window.location.href = getNewURLPath('login');

	} catch (error) {
		console.warn(error);
	}
}

function getDashboardHTML () {
	let html = `
	<table class="dashboard">
		<tr>
			<th class="photo-id">ID</th>
			<th class="photo-name">Title</th>
			<th class="photo-url">Image URL</th>
			<th class="photo-description">Description</th>
			<th class="photo-price">Price($)</th>
		</tr>
	`;
	for (let photo of photos) {
		let {id, name, url, description, price} = photo;
		html += `
		<tr>
			<th class="photo-id">${id}</th>
			<th class="photo-name">${name}</th>
			<th class="photo-url">${url}</th>
			<th class="photo-description">${description}</th>
			<th class="photo-price">$${price}</th>
		</tr>
		`;
	}
	html += `
	</table>
	`;
	return html;
}

document.addEventListener('click', logoutClickHandler);

fetchAuthPhotos().then(function (data) {
	let app = document.querySelector('[data-app]');
	if (!app || !data.length) return;
	photos = store(data);
	component(app, getDashboardHTML);
});


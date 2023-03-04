import {component, store} from '../../js/vendor/reef.es.js';
import {getToken, removeToken} from './components/token.js';
import {getNewURLPath} from './components/helpers.js';
import {authURL} from './components/endpoints.js';
import {fetchAuthPhotos} from './components/dashboard.js';

let photos = [],
	token = getToken();

if (!token) window.location.href = getNewURLPath('login');

function logoutClickHandler (event) {
	let link = event.target.closest('[data-loginout="logout"]');
	if (!link) return;
	event.preventDefault();
	link.textContent = 'Logging out...';

	fetch(authURL, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	removeToken();
	window.location.href = getNewURLPath('login');
}

function getDashboardHTML () {
	if (!photos.length) return '<p>Sorry, there are no photos.</p>';

	let html = `
	<table class="dashboard">
		<tr>
			<th class="photo-thumb">Image</th>
			<th class="photo-id">ID</th>
			<th class="photo-name">Title</th>
			<th class="photo-description">Description</th>
			<th class="photo-price">Price($)</th>
		</tr>
	`;
	for (let photo of photos) {
		let {id, name, url, description, price} = photo;
		html += `
		<tr>
			<td class="photo-thumb"><img src="${url}" alt="${description}" /></td>
			<td class="photo-id">${id}</td>
			<td class="photo-name">${name}</td>
			<td class="photo-description">${description}</td>
			<td class="photo-price">$${price}</td>
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
	if (!app) return;
	photos = store(data);
	component(app, getDashboardHTML);
});


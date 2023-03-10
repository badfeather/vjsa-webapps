import {component, store} from '../../js/vendor/reef.es.js';
import {getNewURLPath} from './components/helpers.js';
import {fetchAuthPhotos} from './components/dashboard.js';
import './components/logout.js';

let photos = [];

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
			<th class="photo-edit"></th>
			<th class="photo-delete"></th>
		</tr>
	`;
	for (let photo of photos) {
		let {id, name, url, description, price} = photo;
		let editURL = `${getNewURLPath('edit')}?id=${encodeURIComponent(id)}`;
		let deleteURL = `${getNewURLPath('delete')}?id=${encodeURIComponent(id)}`;
		html += `
		<tr>
			<td class="photo-thumb"><img src="${url}" alt="${description}" /></td>
			<td class="photo-id">${id}</td>
			<td class="photo-name">${name}</td>
			<td class="photo-description">${description}</td>
			<td class="photo-price">$${price}</td>
			<td class="photo-edit"><a href="${editURL}" data-edit-photo>Edit</a></td>
			<td class="photo-delete"><a href="${deleteURL}" data-delete-photo>Delete</a></td>
		</tr>
		`;
	}
	html += `
	</table>
	<p><a class="btn" href="${getNewURLPath('new')}">Add new photo</a></p>
	`;
	return html;
}

fetchAuthPhotos().then(function (data) {
	let app = document.querySelector('[data-app]');
	if (!app) return;
	photos = store(data);
	component(app, getDashboardHTML);
});


import {render} from '../../js/vendor/reef.es.js';
import {fetchPhotos} from './components/photos.js';
import './components/cart.js';

let photos = [];

function getPhotosHTML () {
	if (!photos.length) return '<p>Error retrieving photos.</p>';
	let html = '<div id="photos" class="cards photos">';
	for (let photo of photos) {
		html += `
		<article id="${photo.id}" class="card">
			<figure class="card-figure">
				<a href="photo/index.html?id=${encodeURIComponent(photo.id)}">
					<img src="${photo.url}" alt="${photo.description}" />
				</a>
			</figure>
		</article>
		`;
	}
	html += '</div>';
	return html;
}

fetchPhotos().then(function (data) {
	photos = data;
	let app = document.querySelector('[data-app]');
	if (!app) return;
	render(app, getPhotosHTML());
});

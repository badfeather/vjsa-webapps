import {fetchPhotos} from './components/fetch-photos.js';

function getPhotoHTML (photo, type) {
	type = ['card', 'single'].includes(type) ? type : 'card';
	let header = '',
		href = '',
		before = '',
		after = '',
		urlObj = new URL(window.location.href);

	if (type === 'single') {
		urlObj.search = '';
		document.title = `${photo.name} | ${document.title}`;
		href = urlObj.toString();
		before = `<p><a href="${href}" class="btn" btn--all">All Photos</a></p>`;
		header = `
<header class="${type}-header">
	<h2 class="${type}-title">${photo.name}</h2>
	<div class="${type}-description">${photo.description}</h2>
	<div class="${type}-price">$${photo.price}</div>
</header>
		`;
	}

	if (type === 'card') {
		urlObj.search = '';
		let params = urlObj.searchParams;
		params.set('id', photo.id);
		urlObj.search = params;
		href = urlObj.toString();
		before = `<a href="${href}">`;
		after = '</a>';
	}

	return `
${before}
<article id="${photo.id}" class="${type}">
	<figure class="card-figure">
		<img src="${photo.url}" alt="${photo.description}" />
	</figure>
	${header}
</article>
${after}
	`;
}

function getPhotosHTML (photos) {
	if (!photos.length) return '<p>Error retrieving photos.</p>';
	let html = '';
	let id = new URL(window.location.href).searchParams.get('id');
	let photo;
	if (id) {
		photo = photos.find(function(photo) {
			return photo.id === id;
		});
		if (photo) return getPhotoHTML(photo, 'single');
	}

	html += '<div id="photos" class="cards photos">';
	for (let photo of photos) {
		html += getPhotoHTML(photo, 'card');
	}
	html += '</div>';
	return html;
}

let app = document.getElementById('app');
fetchPhotos().then(function (photos) {
	app.innerHTML = getPhotosHTML(photos);
});

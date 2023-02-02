let app = document.getElementById('app');
let errorMsg = '<p>No photos for you!</p>';

async function fetchPhotos (endpoint = 'https://vanillajsacademy.com/api/photos.json') {
	if (!endpoint) return;
	try {
		let response = await fetch(endpoint);
		if (!response.ok) throw response;
		let photos = await response.json();
		app.innerHTML = getPhotosHTML(photos);
	} catch (error) {
		console.warn(error);
		app.innerHTML = errorMsg;
	}
}

function getPhotosHTML (photos) {
	if (!photos || !photos.length) app.innerHTML = errorMsg;
	let html = '<div id="photos" class="cards photos">';
	console.log(photos);
	for (let p of photos) {
		console.log(p.id);
		html += `
<article id="${p.id}" class="card">
	<figure class="card-figure">
		<img src="${p.url}" alt="${p.description}" />
	</figure>

	<header class="card-header">
		<h2 class="card-title">${p.name}</h2>
		<div class="card-price">$${p.price}</div>
	</header>
</article>
		`;
	}
	html += '</div>';
	return html;
}

fetchPhotos();

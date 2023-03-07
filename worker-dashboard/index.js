let allowed = ['https://badfeather.github.io', 'https://localhost:8080'],
	headers = new Headers({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
		'Access-Control-Allow-Headers': '*'
	});

/**
 * Get the user token from the API request
 * @param  {Request} request The request object
 * @return {String}          The session token
 */
function getToken (request) {

	// If GET request, get query parameter
	if (request.method === 'GET') {
		return new URL(request.url).searchParams.get('token');
	}

	// Otherwise, get authorization header
	let [scheme, encoded] = request.headers.get('Authorization').split(' ');

	// if Bearer, get token
	if (scheme === 'Bearer') {
		return encoded;
	}
}

/**
 * Check if token is for a valid session
 * @param  {String}  token The session token
 * @return {Boolean}       If true, user is logged in
 */
async function isLoggedIn (token) {
	// Check for token in database
	let session = await TOKENS.get(token);

	// If session exists, user is logged in
	return session === null ? false : true;
}

function getPhotoByID (id, photos) {
	if (!photos.length) return false;
	return photos.find(function(item) {
		return item.id === id;
	});
}

/**
 * Get the index of the photo to edit by its ID
 * @param  {Array}  photos All photos
 * @param  {String} id     The ID of the photo to get
 * @return {Object}        The photo index
 */
function getPhotoIndexByID (photos, id) {
	return photos.findIndex(function (photo) {
		return photo.id === id;
	});
}

/**
 * Handle GET requests
 * @param  {Request} request The request object
 * @return {Response}        The response
 */
async function handleGET (request) {
	let photos = await PHOTOS.get('photos');

	return new Response(photos, {
		status: 200,
		headers: headers
	});
}



/**
 * Handle PUT requests
 * @param  {Request} request The request object
 * @return {Response}        The response
 */
async function handlePUT (request) {
	let photos = await PHOTOS.get('photos', {type: 'json'});
	let photo = await request.json();

	let {id, name, description, price} = photo;
	if (!id || !name || !description || !price) {
		return new Response('Please provide all required data', {
			status: 400,
			headers: headers
		});
	}

	price = parseFloat(price);
	if (Number.isNaN(price)) {
		return new Response('Price must be a valid number', {
			status: 400,
			headers: headers
		});
	}

	let index = getPhotoIndexByID(photos, id);

	if (index < 0) {
		return new Response('Photo not found', {
			status: 404,
			headers: headers
		});
	}

	// let match = getPhotoByID(id, photos);
	// if (match) {
	// 	match = photo;
	// }
	// Otherwise, update the photo
	Object.assign(photos[index], {name, description, price});
	let updated = await PHOTOS.put('photos', JSON.stringify(photos));

	// If there was a problem, return an error
	if (updated === null) {
		return new Response(`Unable to update photo with ID ${id} not saved`, {
			status: 500,
			headers: headers
		});
	}

	// Otherwise, return the wizard data
	return new Response(`Photo with ID ${id} added.`, {
		status: 200,
		headers: headers
	});
}

/**
 * Handle POST requests
 * @param  {Request} request The request object
 * @return {Response}        The response
 */
async function handlePOST (request) {
	let photos = await PHOTOS.get('photos', {type: 'json'});
	let photo = await request.json();

	let {id, name, description, price} = photo;
	if (!id || !name || !description || !price) {
		return new Response('Please provide all required data', {
			status: 400,
			headers: headers
		});
	}

	let match = getPhotoByID(id, photos);
	if (match) {
		return new Response('Photo already exists', {
			status: 409,
			headers: headers
		});
	}

	price = parseFloat(price);
	if (Number.isNaN(price)) {
		return new Response('Price must be a valid number', {
			status: 400,
			headers: headers
		});
	}


	photos.push(photo);
	let updated = await PHOTOS.put('photos', JSON.stringify(photos));

	// If the photo wasn't saved
	if (updated === null) {
		return new Response(`Photo with ID ${id} not saved`, {
			status: 404,
			headers: headers
		});
	}

	// Otherwise, return the photo data
	return new Response(`Photo with ID ${id} added.`, {
		status: 200,
		headers: headers
	});
}

/**
 * Handle DELETE requests
 * @param  {Request} request The request object
 * @return {Response}        The response
 */
async function handleDELETE (request) {
	let photos = await PHOTOS.get('photos', {type: 'json'});
	let photo = await request.json();

	let match = getPhotoByID(photo.id, photos);
	let filtered = [];
	if (match) {
		filtered = photos.filter( function (obj) {
			return obj !== match;
		});
	}

	let updated = await PHOTOS.put('photos', JSON.stringify(filtered));

	if (updated === null) {
		return new Response(`Photo with ID ${photo.id} not deleted.`, {
			status: 404,
			headers: headers
		});
	}

	// Confirm the deletion
	return new Response(JSON.stringify(`Photo with ID ${photo.id} deleted.`), {
		status: 200,
		headers: headers
	});
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
	if (!allowed.includes(request.headers.get('origin'))) {
		return new Response('Not allowed', {
			status: 403,
			headers: headers
		});
	}

	// Get token from request
	let token = getToken(request);

	// If user is not logged in, return error
	let loggedIn = await isLoggedIn(token);
	if (!loggedIn) {
		return new Response('Not logged in', {
			status: 401,
			headers: headers
		});
	}

	// Handle the OPTIONS method
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 200,
			headers: headers
		});
	}

	// Handle the GET method
	if (request.method === 'GET') {
		return await handleGET(request);
	}

	// Handle the PUT method
	if (request.method === 'PUT') {
		return await handlePUT(request);
	}

	// Handle the POST method
	if (request.method === 'POST') {
		return await handlePOST(request);
	}

	// Handle the DELETE method
	if (request.method === 'DELETE') {
		return await handleDELETE(request);
	}

	// Everything else
	return new Response('Not allowed', {
		status: 400,
		headers
	});
}

// Listen for API calls
addEventListener('fetch', function (event) {
	event.respondWith(handleRequest(event.request));
});

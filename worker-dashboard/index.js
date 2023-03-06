let allowed = ['https://badfeather.github.io', 'https://localhost:8080'],
	photos,
	photo,
	headers = new Headers({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
		'Access-Control-Allow-Headers': '*'
	});;

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

function getPhotoByID (id, photos) {
	if (!photos.length) return false;
	return photos.find(function(item) {
		return item.id === id;
	});
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

/**
 * Handle GET requests
 * @param  {Request} request The request object
 * @return {Response}        The response
 */
async function handleGET (request) {
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
	let match = getPhotoByID(photo.id, photos);
	if (match) {
		match = photo;
	}
	let updated = PHOTOS.put('photos', JSON.stringify(photos));

	// If there was a problem, return an error
	if (updated === null) {
		return new Response(`Photo with ID ${photo.id} not saved`, {
			status: 404,
			headers: headers
		});
	}

	// Otherwise, return the wizard data
	return new Response(`Photo with ID ${photo.id} added.`, {
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
	let match = getPhotoByID(photo.id, photos);
	if (match) {
		return new Response('Photo already exists', {
			status: 409,
			headers: headers
		});
	}
	photos.push(photo);
	let updated = await PHOTOS.put('photos', JSON.stringify(photos));

	// If the wizard wasn't saved
	if (updated === null) {
		return new Response(`Photo with ID ${photo.id} not saved`, {
			status: 404,
			headers: headers
		});
	}

	// Otherwise, return the wizard data
	return new Response(`Photo with ID ${photo.id} added.`, {
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

	photos = await PHOTOS.get('photos');

	// Handle the GET method
	if (request.method === 'GET') {
		return await handleGET(request);
	}

	photo = await request.json();

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
}

// Listen for API calls
addEventListener('fetch', function (event) {
	console.log(event.request);
	event.respondWith(handleRequest(event.request));
});

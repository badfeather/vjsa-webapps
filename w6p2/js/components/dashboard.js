import {dashURL} from './endpoints.js';
import {getNewURLPath} from './helpers.js';
import {getToken, removeToken} from './token.js';

async function fetchAuthPhotos () {
	let token = getToken();

	try {
		let response = await fetch(`${dashURL}?token=${token}`);
		if (!response.ok) throw response;

		if (response.status === 401) {
			removeToken();
			window.location.href = getNewURLPath('login');
		}
		return await response.json();

	} catch (error) {
		console.warn(error);
		return [];
	}
}

/**
 * Edit photo data
 * @param {Object} data The photo data
 */
async function editPhoto (data) {

	// Get photos from API
	let response = await fetch(dashURL, {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${getToken()}`
		}
	});

	// Return status
	return await response.text();

}

/**
 * Edit photo data
 * @param {Object} data The photo data
 */
async function addPhoto (data) {

	// Get photos from API
	let response = await fetch(dashURL, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${getToken()}`
		}
	});

	// Return status
	return await response.text();

}

export {fetchAuthPhotos, editPhoto, addPhoto}

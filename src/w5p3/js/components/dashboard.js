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

export {fetchAuthPhotos}

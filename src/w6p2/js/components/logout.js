import {authURL} from './endpoints.js';
import {getToken, removeToken} from './token.js';
import {getNewURLPath, getCleanURL} from './helpers.js';

let token = getToken();
let loginURL = getNewURLPath('login', getCleanURL());
if (!token) {
	window.location.href = loginURL;
}

function logoutClickHandler (event) {
	let link = event.target.closest('[data-loginout]');
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
	window.location.href = loginURL;
}

document.addEventListener('click', logoutClickHandler);

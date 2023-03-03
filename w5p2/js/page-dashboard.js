import {getToken, removeToken} from './components/token.js';
import {getNewURLPath} from './components/helpers.js';
import {authURL} from './components/endpoints.js';

async function logoutClickHandler (event) {
	let link = event.target.closest('[data-loginout="logout"]');
	if (!link) return;
	event.preventDefault();
	link.textContent = 'Logging out...';

	try {
		let response = await fetch(authURL, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (!response.ok) throw response;
		removeToken();
		window.location.href = getNewURLPath('login');

	} catch (error) {
		console.warn(error);
	}
}

let token = getToken();
console.log('Token: ' + token);
if (!token) window.location.href = getNewURLPath('login');

// Otherwise, listen for click events on the logout link
document.addEventListener('click', logoutClickHandler);


import {serialize, getNewURLPath} from './components/helpers.js';
import {authURL} from './components/endpoints.js';

async function submitHandler (event) {
	event.preventDefault();
	if (form.hasAttribute('data-submitting')) return;
	let {username, password} = serialize(new FormData(form));
	if (!username || !password) {
		status.textContent = 'Please include a username and password.';
		return;
	}

	form.setAttribute('data-submitting', true);
	let auth = btoa(`${username}:${password}`);

	try {
		let response = await fetch(authURL, {
			method: 'PUT',
			headers: {
				'Authorization': `Basic ${auth}`
			}
		});

		if (!response.ok) throw response;
		status.innerText = `New user credentials created! Log in using your new credentials.`;
		window.location.href = getNewURLPath('login');

	} catch (error) {
		form.reset();
		form.removeAttribute('data-submitting');
		status.innerText = 'Something went wrong. Please try again.';
	}
}

let form = document.querySelector('[data-form="signup"]');
let status = document.querySelector('[data-form-status]');

if (form && status) form.addEventListener('submit', submitHandler);


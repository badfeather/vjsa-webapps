import {setToken, getToken} from './components/token.js';
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
			method: 'POST',
			headers: {
				'Authorization': `Basic ${auth}`
			}
		});

		if (!response.ok) throw response;
		let {token} = await response.json();
		console.log(token);
		setToken(token);
		status.innerText = `Success! Redirecting to dashboard.`;
		window.location.href = getNewURLPath('dashboard');

	} catch (error) {
		form.reset();
		form.removeAttribute('data-submitting');
		status.innerText = 'Something went wrong. Please try again.';
	}
}

let storedToken = getToken();
if (storedToken) {
	console.log('stored token: ' + storedToken);
	window.location.href = getNewURLPath('dashboard');
}
let form = document.querySelector('[data-form="login"]');
let status = document.querySelector('[data-form-status]');

if (form && status) form.addEventListener('submit', submitHandler);



import {dummyAuthURL} from './components/endpoints.js';

function serialize (data) {
	let obj = {};
	for (let [key, value] of data) {
		if (obj[key] !== undefined) {
			if (!Array.isArray(obj[key])) {
				obj[key] = [obj[key]];
			}
			obj[key].push(value);
		} else {
			obj[key] = value;
		}
	}
	return obj;
}

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
		let login = await fetch(dummyAuthURL, {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${auth}`
			}
		});

		if (!login.ok) throw login;
		let {token} = await login.json();
		status.innerText = `Success! Your authentication token is: ${token}`;

	} catch (error) {
		form.reset();
		form.removeAttribute('data-submitting');
		status.innerText = 'Something went wrong. Please try again.';
	}
}

let form = document.querySelector('[data-form]');
let status = document.querySelector('[data-form-status]');

if (form && status) form.addEventListener('submit', submitHandler);


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

let form = document.querySelector('[data-form]');
let status = document.querySelector('[data-form-status]');

if (form && status) form.addEventListener('submit', function(event) {
	event.preventDefault();
	let formData = new FormData(form);
	let dataObj = serialize(formData);
	console.log(dataObj);
	let username = dataObj.username;
	let password = dataObj.password;
	let auth = btoa(`${username}:${password}`);

	fetch('https://vanillajsacademy.com/api/login.php', {
		headers: {
			'Authorization': `Basic ${auth}`
		}

	}).then(function (response) {
		if (response.ok) {
			return response.json();
		}
		throw response;

	}).then(function (data) {
		status.innerHTML = 'Hooray! That worked.';
		console.log(data);

	}).catch(function (error) {
		status.innerHTML = 'Sorry, the username or password you entered is invalid.';
		console.warn(error);
	});
});


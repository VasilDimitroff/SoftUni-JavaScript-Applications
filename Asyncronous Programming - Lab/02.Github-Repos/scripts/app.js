function loadRepos() {

	let username = document.getElementById('username').value;
	let button = document.querySelector('button');
	let list = document.querySelector('#repos');


	fetch(`https://api.github.com/users/${username}/repos`)
	.then(response => {
		if(response.ok !== true){
			throw new Error(`${response.status} ${response.statusText}`);
		}
		return response.json()
	})
	.then(data => enterData(data))
	.catch(error => {
		list.innerHTML = '';
		document.getElementById('username').value = '';
		let li = document.createElement('li');
		li.textContent = error.message;
		list.appendChild(li);
	});

	function enterData(data){
		list.innerHTML = '';
		for (const iterator of data) {
			let liElement = document.createElement('li');
			liElement.innerHTML = `<a href="${iterator.html_url}">
			${iterator.full_name}
		</a>`;
			list.appendChild(liElement);
		}

		
		document.getElementById('username').value = '';
	}
}
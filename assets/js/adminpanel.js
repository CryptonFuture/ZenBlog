(function ($) {

	"use strict";

	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});

	const accessToken = localStorage.getItem('token')

	if (!accessToken) {
		window.location.href = '/';
	}

})(jQuery);

document.addEventListener('DOMContentLoaded', () => {
	fetchDashboard()
	fetchPost()
	fetchTags()
	fetchUsers()
	fetchPages()
})

const prefix = 'api/v1'
const baseUrl = `http://localhost:8000/${prefix}`

const tokenType = localStorage.getItem('tokenType')
const access_Token = localStorage.getItem('token')

async function fetchDashboard() {
	const res = await fetch(`${baseUrl}/countAll`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	const counts = data.count

	Object.entries(counts).map(([key, item]) => {
		const card = `
				<div class="col-12 col-sm-6 col-md-3 mb-4">
					<div class="card h-100" style="background-color: ${item.bgcolor2}">
						<div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
							<h5 class="card-title" style="color: ${item.textColor}">${item.title}</h5>
							<p class="card-text fs-4 fw-semibold mb-0" style="color: ${item.textColor}">${item.total}</p>
						</div>
					</div>
				</div>
			`;
		document.getElementById('cardRow').insertAdjacentHTML('beforeend', card)
	})
}

async function fetchPost() {
	const res = await fetch(`${baseUrl}/getPost`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	const post = data.data

	console.log('FETCH DATA', post);


	const list = document.getElementById('postlist')

	list.innerHTML = '';

	post.forEach((item, index) => {

		list.innerHTML += `
		  <tr>
              <th scope="row">${index + 1}</th>
              <td>${item.title}</td>
              <td>${item.description}</td>
              <td>${item.status ? 'Published' : 'UnPublished'}</td>
			  <td>${new Date(item.createdAt).toISOString().split('T')[0]}</td>
			<td>${new Date(item.updatedAt).toISOString().split('T')[0]}</td>
              <td>
                <button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  &#8942;
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#"> <i class="fas fa-eye me-2 text-warning"></i> View</a></li>
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#editModal"> <i
                        class="fas fa-edit me-2 text-info"></i> Edit</a></li>
                  <li><a class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a>
                  </li>
                </ul>

              </td>
            </tr>
		`;
	})

}



async function fetchTags() {
	const res = await fetch(`${baseUrl}/getTag`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		}
	});

	const data = await res.json();
	const tags = data.data;

	console.log('TAG DATA', tags);  // Optional for debugging

	const list = document.getElementById('taglist');
	list.innerHTML = '';

	tags.forEach((item, index) => {
		list.innerHTML += `
			<tr>
				<th scope="row">${index + 1}</th>
				<td>${item.tagName}</td>
				<td>${item.description}</td>
				<td>${item.status ? 'Active' : 'Inactive'}</td>
				<td>${new Date(item.createdAt).toISOString().split('T')[0]}</td>
				<td>${new Date(item.updatedAt).toISOString().split('T')[0]}</td>
				<td>
					<button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					  &#8942;
					</button>
					<ul class="dropdown-menu">
					  <li><a class="dropdown-item" href="#"> <i class="fas fa-eye me-2 text-warning"></i> View</a></li>
					  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edittag"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
					</ul>
				</td>
			</tr>
		`;
	});
}




async function fetchPages() {
	const res = await fetch(`${baseUrl}/getPages`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		}
	});

	const data = await res.json();
	const pages = data.data;

	console.log('PAGE DATA', pages);

	const list = document.getElementById('pagelist');
	list.innerHTML = '';

	pages.forEach((item, index) => {
		list.innerHTML += `
			<tr>
				<th scope="row">${index + 1}</th>
				<td>${item.pageName}</td>
				<td>${item.description}</td>
				<td>${item.status}</td>
				<td>${item.createdAt}</td>
				<td>${new Date(item.createdAt).toISOString().split('T')[0]}</td>
				<td>
					<button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					  &#8942;
					</button>
					<ul class="dropdown-menu">
					  <li><a class="dropdown-item" href="#"> <i class="fas fa-eye me-2 text-warning"></i> View</a></li>
					  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#editpage"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
					</ul>
				</td>
			</tr>
		`;
	});
}






async function fetchUsers() {
	const res = await fetch(`${baseUrl}/getUser`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		}
	});

	const data = await res.json();
	const users = data.data;

	console.log('USER DATA', users);

	const list = document.getElementById('userlist');
	list.innerHTML = '';

	users.forEach((item, index) => {
		list.innerHTML += `
			<tr>
				<th scope="row">${index + 1}</th>
				<td>${item.firstname}</td>
				<td>${item.lastname}</td>
				<td>${item.email}</td>
				<td>
					<button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					  &#8942;
					</button>
					<ul class="dropdown-menu">
					  <li><a class="dropdown-item" href="#"> <i class="fas fa-eye me-2 text-warning"></i> View</a></li>
					  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edituser"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
					</ul>
				</td>
			</tr>
		`;
	});
}








async function logout() {
	const userId = localStorage.getItem('user')

	const res = await fetch(`${baseUrl}/logout?id=${userId}`, {
		method: 'POST'
	})

	const data = await res.json()

	if (res.ok) {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('email');
		localStorage.removeItem('tokenType');
		localStorage.removeItem('rememberMe')
		localStorage.removeItem('rememberedEmail');
		localStorage.removeItem('rememberedPassword');

		Swal.fire({
			icon: 'success',
			title: 'Logout Successful',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			window.location.href = '/';

		});

	} else {
		Swal.fire({
			icon: 'error',
			title: 'Logout Failed',
			text: data.message
		});
	}
}


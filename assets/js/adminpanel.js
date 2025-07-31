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
                  <li><a onclick="editPost('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#editModal"> <i
                        class="fas fa-edit me-2 text-info"></i> Edit</a></li>
                  <li><a onclick="deletePost('${item._id}')" class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a>
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
					  <li><a onclick="editTag('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edittag"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a onclick="deleteTag('${item._id}')" class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
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
					  <li><a onclick="editPage('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#editpage"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a onclick="deletePages('${item._id}')" class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
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
					  <li><a onclick="editUser('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edituser"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a onclick="deleteUser('${item._id}')" class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
					</ul>
				</td>
			</tr>
		`;
	});
}



async function deletePost(id) {
	const result = await Swal.fire({
		title: 'Are you sure you want to delete this tag?',
		text: 'You won\'t be able to revert this!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Yes, delete it!',
		cancelButtonText: 'Cancel'
	})

	if(result.isConfirmed) {
	const res = await fetch(`${baseUrl}/deletePost/${id}`, {
		method: 'DELETE',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})
	

	const data = await res.json()

	if (res.ok) {
			Swal.fire({
				icon: 'success',
				title: 'Delete Successfully',
				text: data.message,
				timer: 2000,
				showConfirmButton: false,
				timerProgressBar: true
			}).then(() => {
				fetchPost();
			});

		} else {
			Swal.fire({
				icon: 'error',
				title: `Failed to delete post: ${data.error}`,
				text: data.error,
				timer: 2000,
				showConfirmButton: false,
				timerProgressBar: true
			})
		}
		}
}

async function createPost() {
	const title = document.getElementById('post-title').value
	const description = document.getElementById('post-description').value

	const res = await fetch(`${baseUrl}/addPost`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		},
		body: JSON.stringify({title, description})
	})

	const data = await res.json()

	if (res.ok) {
		Swal.fire({
			icon: 'success',
			title: 'Create Post Successfully',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			fetchPost();
			$('#exampleModal').modal('hide');
			document.getElementById('title').value = ""
			document.getElementById('description').value = ""
		});
	} else {
		Swal.fire({
			icon: 'error',
			title: `Failed to delete post: ${data.error}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}

}






async function createUser() {
	const firstname = document.getElementById('first-name').value;
	const lastname = document.getElementById('last-name').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const confirmPass = document.getElementById('confirm-password').value;

	// Optionally check if passwords match
	if (password !== confirmPass) {
		Swal.fire({
			icon: 'error',
			title: 'Password Mismatch',
			text: 'Password and Confirm Password do not match!',
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		});
		return;
	}

	const res = await fetch(`${baseUrl}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		},
		body: JSON.stringify({
			firstname,
			lastname,
			email,
			password,
			confirmPass
		})
	});

	const data = await res.json();

	if (res.ok) {
		Swal.fire({
			icon: 'success',
			title: 'User Created Successfully',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			fetchUsers(); // tumhari fetch wali function agar hai to
			$('#exampleModal4').modal('hide');
			document.getElementById('first-name').value = "";
			document.getElementById('last-name').value = "";
			document.getElementById('email').value = "";
			document.getElementById('password').value = "";
			document.getElementById('confirm-password').value = "";
		});
	} else {
		Swal.fire({
			icon: 'error',
			title: `Failed to create user`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		});
	}
}










async function createTag() {
	const tagName = document.getElementById('tag-name').value;
	const description = document.getElementById('description').value;

	const res = await fetch(`${baseUrl}/addTag`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		},
		body: JSON.stringify({ tagName, description })
	});

	const data = await res.json();

	if (res.ok) {
		Swal.fire({
			icon: 'success',
			title: 'Tag Created Successfully',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			fetchTags();
			$('#exampleModal2').modal('hide');
			document.getElementById('tag-name').value = "";
			document.getElementById('description').value = "";
		});
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Failed to Create Tag',
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		});
	}
}












async function createPage() {
	const pageName = document.getElementById('page-name').value;
	const description = document.getElementById('page-description').value;

	const res = await fetch(`${baseUrl}/addPages`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		},
		body: JSON.stringify({ pageName, description })
	});

	const data = await res.json();

	if (res.ok) {
		Swal.fire({
			icon: 'success',
			title: 'Page Created Successfully',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			fetchPages();
			$('#exampleModal3').modal('hide');
			document.getElementById('page-name').value = "";
			document.getElementById('page-description').value = "";
		});
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Failed to Create Page',
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		});
	}
}










function setupAutoLogout() {
	const expiryTime = localStorage.getItem('tokenExpiry');
	
	if (!expiryTime) return;

	const timeLeft = expiryTime - Date.now();

	if (timeLeft <= 0) {
		logout();
	} else {
		setTimeout(() => {
			logout();
		}, timeLeft);
	}
}

window.addEventListener('load', () => {
	setupAutoLogout();
});


async function deleteTag(id) {
	const result = await Swal.fire({
		title: 'Are you sure you want to delete this tag?',
		text: 'You won\'t be able to revert this!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Yes, delete it!',
		cancelButtonText: 'Cancel'
	});

	if (result.isConfirmed) {
		const res = await fetch(`${baseUrl}/deleteTag/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `${tokenType} ${access_Token}`
			}
		});

		const data = await res.json();

		if (res.ok) {
			Swal.fire({
				icon: 'success',
				title: 'Deleted Successfully',
				text: data.message,
				timer: 2000,
				showConfirmButton: false,
				timerProgressBar: true
			}).then(() => {
				fetchTags();
			});
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Failed to delete tag',
				text: data.error,
				timer: 2000,
				showConfirmButton: false,
				timerProgressBar: true
			});
		}
	}
}




async function deleteUser(id) {
	const result = await Swal.fire({
		title: 'Are you sure you want to delete this tag?',
		text: 'You won\'t be able to revert this!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Yes, delete it!',
		cancelButtonText: 'Cancel'
	});

	if (result.isConfirmed) {
		const res = await fetch(`${baseUrl}/deleteUser/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `${tokenType} ${access_Token}`
			}
		});

		const data = await res.json();

		if (res.ok) {
			Swal.fire({
				icon: 'success',
				title: 'Deleted Successfully',
				text: data.message,
				timer: 2000,
				showConfirmButton: false,
				timerProgressBar: true
			}).then(() => {
				fetchUsers();
			});
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Failed to delete tag',
				text: data.error,
				timer: 2000,
				showConfirmButton: false,
				timerProgressBar: true
			});
		}
	}
}



async function deletePages(id) {
	const result = await Swal.fire({
		title: 'Are you sure you want to delete this tag?',
		text: 'You won\'t be able to revert this!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Yes, delete it!',
		cancelButtonText: 'Cancel'
	});

	if (result.isConfirmed) {
		const res = await fetch(`${baseUrl}/deletePage/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `${tokenType} ${access_Token}`
			}
		});

		const data = await res.json();

		if (res.ok) {
			Swal.fire({
				icon: 'success',
				title: 'Deleted Successfully',
				text: data.message,
				timer: 2000,
				showConfirmButton: false,
				timerProgressBar: true
			}).then(() => {
				fetchPages();
			});
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Failed to delete tag',
				text: data.error,
				timer: 2000,
				showConfirmButton: false,
				timerProgressBar: true
			});
		}
	}
}






async function logout() {
	const userId = localStorage.getItem('user')

	const res = await fetch(`${baseUrl}/logout?id=${userId}`, {
		method: 'POST',
		headers: {
				'Authorization': `${tokenType} ${access_Token}`
			}
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
		localStorage.removeItem('tokenExpiry');

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
			text: data.error
		});
	}
}

async function editPost(id) {
	const res = await fetch(`${baseUrl}/editPostById/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	if (res.ok && data.success && data.data.length > 0) {
		const post = data.data[0]
		document.getElementById('edit-post-id').value = post._id
		document.getElementById('edit-post-title').value = post.title
		document.getElementById('edit-post-description').value = post.description
		document.getElementById('edit-post-status').checked = post.status

	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete post: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}
}





async function editUser(id) {
	const res = await fetch(`${baseUrl}/editUserById/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	if (res.ok && data.success && data.data.length > 0) {
		const user = data.data[0]
		document.getElementById('edit-user-id').value = user._id
		document.getElementById('edit-user-first-name').value = user.firstname
		document.getElementById('edit-user-last-name').value = user.lastname
		document.getElementById('edit-user-email').value = user.email
		document.getElementById('edit-user-status').checked = user.status
		document.getElementById('edit-user-admin').checked = user.Admin

	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete post: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}
}



async function editTag(id) {
	const res = await fetch(`${baseUrl}/editTagById/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	if (res.ok && data.success && data.data.length > 0) {
		const post = data.data[0]
		document.getElementById('edit-tag-id').value = post._id
		document.getElementById('edit-tag-tagname').value = post.tagName
		document.getElementById('edit-tag-description').value = post.description
		document.getElementById('edit-tag-status').checked = post.status

	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete post: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}
}





async function editPage(id) {
	const res = await fetch(`${baseUrl}/editPagesById/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	if (res.ok && data.success && data.data.length > 0) {
		const page = data.data[0]
		document.getElementById('edit-page-id').value = page._id
		document.getElementById('edit-page-pagename').value = page.pageName
		document.getElementById('edit-page-description').value = page.description
		document.getElementById('edit-page-status').checked = page.status

	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete post: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}
}
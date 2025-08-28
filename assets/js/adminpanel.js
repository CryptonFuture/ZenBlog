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
	countPost()
	countUser()
	countPages()
	countTag()
})

const prefix = 'api/v1'
const baseUrl = `http://localhost:8000/${prefix}`

const tokenType = localStorage.getItem('tokenType')
const access_Token = localStorage.getItem('token')

let currentPage = 1;
const limit = 5;
let totalPages = 1;

let currentTagPage = 1;
let totalTagPages = 1;

let currentPagePage = 1;
let totalPagePages = 1;

let currentUserPage = 1;
let totalUserPages = 1;

let filters = {
	status: "",
	date: "",
};


function resetFilters() {
	document.getElementById('statusFilter').value = "";
	document.getElementById('date').value = "";

	filters.status = "";
	filters.date = "";

	currentPage = 1;
	fetchPost();
	countPost()	
}

function clearFilters() {
	document.getElementById('statusFilter').value = "";
	document.getElementById('date').value = "";

	filters.status = "";
	filters.date = "";

	currentPage = 1;

}


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

async function fetchPost(page = 1) {

	currentPage = page;

	const sortValue = document.getElementById('sortPostSelect')?.value || "";

	const searchInput = document.getElementById('searchInput')?.value || "";

	const queryParams = new URLSearchParams({
		search: searchInput,
		sort: sortValue,
		limit,
		page: currentPage,
		status: filters.status,
		date: filters.date
	});

	const res = await fetch(`${baseUrl}/getPost?${queryParams.toString()}`, {
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

	if (!data.success || post.length === 0) {
		list.innerHTML = `<tr><td colspan="7" class="text-center">${data.error}</td></tr>`;
		document.getElementById('pagination').innerHTML = '';
		return;
	}

	post.forEach((item, index) => {

		list.innerHTML += `
		  <tr>
              <th scope="row">${(currentPage - 1) * limit + index + 1}</th>
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
                  <li>
					<a onclick="viewPost('${item._id}')" class="dropdown-item view-btn" href="#" data-bs-toggle="modal" data-bs-target="#viewPostModal">
						<i class="fas fa-eye me-2 text-warning"></i> View
					</a>
				  </li>
                  <li><a onclick="editPost('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#editModal"> <i
                        class="fas fa-edit me-2 text-info"></i> Edit</a></li>
                  <li><a onclick="deletePost('${item._id}')" class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a>
                  </li>
                </ul>

              </td>
            </tr>
		`;
	})
	totalPages = data.pagination.totalPages;
	renderPaginationButtons(totalPages);

}

function renderPaginationButtons(total) {
	const pagination = document.getElementById('pagination');
	pagination.innerHTML = '';

	const prev = document.createElement('li');
	prev.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
	prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
	prev.onclick = (e) => {
		e.preventDefault();
		if (currentPage > 1) fetchPost(currentPage - 1);
	};
	pagination.appendChild(prev);

	for (let i = 1; i <= total; i++) {
		const pageBtn = document.createElement('li');
		pageBtn.className = `page-item ${i === currentPage ? 'active' : ''}`;
		pageBtn.innerHTML = `<a class="page-link" href="#">${i}</a>`;
		pageBtn.onclick = (e) => {
			e.preventDefault();
			fetchPost(i);
		};
		pagination.appendChild(pageBtn);
	}

	const next = document.createElement('li');
	next.className = `page-item ${currentPage === total ? 'disabled' : ''}`;
	next.innerHTML = `<a class="page-link" href="#">Next</a>`;
	next.onclick = (e) => {
		e.preventDefault();
		if (currentPage < total) fetchPost(currentPage + 1);
	};
	pagination.appendChild(next);
}

document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		currentPage = 1;
		fetchPost();
	}
});

document.getElementById('sortPostSelect')?.addEventListener('change', () => {
	currentPage = 1;
	fetchPost();
});

function applyFilters() {
	filters.status = document.getElementById('statusFilter').value;
	filters.date = document.getElementById('date').value;

	currentPage = 1;

	fetchPost();
}



async function fetchTags(page = 1) {

	currentTagPage = page;

	const sortValue = document.getElementById('sortTagSelect')?.value || "";

	const searchInput = document.getElementById('searchTag')?.value || "";

	const queryParams = new URLSearchParams({
		search: searchInput,
		sort: sortValue,
		limit,
		page: currentTagPage
	});

	const res = await fetch(`${baseUrl}/getTag?${queryParams.toString()}`, {
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

	if (!data.success || tags.length === 0) {
		list.innerHTML = `<tr><td colspan="7" class="text-center">${data.error}</td></tr>`;
		document.getElementById('paginationTag').innerHTML = '';
		return;
	}

	tags.forEach((item, index) => {
		list.innerHTML += `
			<tr>
				<th scope="row">${(currentTagPage - 1) * limit + index + 1}</th>
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
					  <li><a onclick="viewTag('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#viewTagModal"> <i class="fas fa-eye me-2 text-warning"></i> View</a></li>
					  <li><a onclick="editTag('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edittag"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a onclick="deleteTag('${item._id}')" class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
					</ul>
				</td>
			</tr>
		`;
	});
	totalTagPages = data.pagination.totalPages;
	renderTagPaginationButtons(totalTagPages);
}

function renderTagPaginationButtons(total) {
	const pagination = document.getElementById('paginationTag');
	pagination.innerHTML = '';

	const prev = document.createElement('li');
	prev.className = `page-item ${currentTagPage === 1 ? 'disabled' : ''}`;
	prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
	prev.onclick = (e) => {
		e.preventDefault();
		if (currentTagPage > 1) fetchTags(currentTagPage - 1);
	};
	pagination.appendChild(prev);

	for (let i = 1; i <= total; i++) {
		const pageBtn = document.createElement('li');
		pageBtn.className = `page-item ${i === currentTagPage ? 'active' : ''}`;
		pageBtn.innerHTML = `<a class="page-link" href="#">${i}</a>`;
		pageBtn.onclick = (e) => {
			e.preventDefault();
			fetchTags(i);
		};
		pagination.appendChild(pageBtn);
	}

	const next = document.createElement('li');
	next.className = `page-item ${currentTagPage === total ? 'disabled' : ''}`;
	next.innerHTML = `<a class="page-link" href="#">Next</a>`;
	next.onclick = (e) => {
		e.preventDefault();
		if (currentTagPage < total) fetchTags(currentTagPage + 1);
	};
	pagination.appendChild(next);
}

document.getElementById('searchTag')?.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		currentTagPage = 1;
		fetchTags();
	}
});

document.getElementById('sortTagSelect')?.addEventListener('change', () => {
	currentTagPage = 1;
	fetchTags();
});


function applyFiltersTag() {
	currentTagPage = 1;
	fetchTags();
}


async function fetchPages(page = 1) {

	currentPagePage = page;

	const sortValue = document.getElementById('sortPagesSelect')?.value || "";

	const searchInput = document.getElementById('searchPages')?.value || "";

	const queryParams = new URLSearchParams({
		search: searchInput,
		sort: sortValue,
		limit,
		page: currentPagePage
	});

	const res = await fetch(`${baseUrl}/getPages?${queryParams.toString()}`, {
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

	if (!data.success || pages.length === 0) {
		list.innerHTML = `<tr><td colspan="7" class="text-center">${data.error}</td></tr>`;
		document.getElementById('paginationPages').innerHTML = '';
		return;
	}

	pages.forEach((item, index) => {
		list.innerHTML += `
			<tr>
				<th scope="row">${(currentPagePage - 1) * limit + index + 1}</th>
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
					  <li><a onclick="viewPage('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#viewPageModal"> <i class="fas fa-eye me-2 text-warning"></i> View</a></li>
					  <li><a onclick="editPage('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#editpage"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a onclick="deletePages('${item._id}')" class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
					</ul>
				</td>
			</tr>
		`;
	});
	totalPagePages = data.pagination.totalPages;
	renderPagePaginationButtons(totalPagePages);
}

function renderPagePaginationButtons(total) {
	const pagination = document.getElementById('paginationPages');
	pagination.innerHTML = '';

	const prev = document.createElement('li');
	prev.className = `page-item ${currentPagePage === 1 ? 'disabled' : ''}`;
	prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
	prev.onclick = (e) => {
		e.preventDefault();
		if (currentPagePage > 1) fetchPages(currentPagePage - 1);
	};
	pagination.appendChild(prev);

	for (let i = 1; i <= total; i++) {
		const pageBtn = document.createElement('li');
		pageBtn.className = `page-item ${i === currentPagePage ? 'active' : ''}`;
		pageBtn.innerHTML = `<a class="page-link" href="#">${i}</a>`;
		pageBtn.onclick = (e) => {
			e.preventDefault();
			fetchPages(i);
		};
		pagination.appendChild(pageBtn);
	}

	const next = document.createElement('li');
	next.className = `page-item ${currentPagePage === total ? 'disabled' : ''}`;
	next.innerHTML = `<a class="page-link" href="#">Next</a>`;
	next.onclick = (e) => {
		e.preventDefault();
		if (currentPagePage < total) fetchPages(currentPagePage + 1);
	};
	pagination.appendChild(next);
}

document.getElementById('searchPages')?.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		currentPagePage = 1;
		fetchPages();
	}
});

document.getElementById('sortPagesSelect')?.addEventListener('change', () => {
	currentPagePage = 1;
	fetchPages();
});


function applyFiltersPages() {
	currentPagePage = 1;
	fetchPages();
}




async function fetchUsers(page = 1) {

	currentUserPage = page;

	const sortValue = document.getElementById('sortUsersSelect')?.value || "";

	const searchInput = document.getElementById('searchUser')?.value || "";

	const queryParams = new URLSearchParams({
		search: searchInput,
		sort: sortValue,
		limit,
		page: currentUserPage
	});

	const res = await fetch(`${baseUrl}/getUser?${queryParams.toString()}`, {
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


	if (!data.success || users.length === 0) {
		list.innerHTML = `<tr><td colspan="7" class="text-center">${data.error}</td></tr>`;
		document.getElementById('paginationUser').innerHTML = '';
		return;
	}

	users.forEach((item, index) => {
		list.innerHTML += `
			<tr>
				<th scope="row">${(currentUserPage - 1) * limit + index + 1}</th>
				<td>${item.firstname}</td>
				<td>${item.lastname}</td>
				<td>${item.email}</td>
				<td>
					<button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					  &#8942;
					</button>
					<ul class="dropdown-menu">
					  <li><a onclick="viewUser('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#viewUserModal"> <i class="fas fa-eye me-2 text-warning"></i> View</a></li>
					  <li><a onclick="editUser('${item._id}')" class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#edituser"> <i class="fas fa-edit me-2 text-info"></i> Edit</a></li>
					  <li><a onclick="deleteUser('${item._id}')" class="dropdown-item" href="#"><i class="fas fa-trash-alt me-2 text-danger"></i> Delete</a></li>
					</ul>
				</td>
			</tr>
		`;
	});
	totalUserPages = data.pagination.totalPages;
	renderUserPaginationButtons(totalUserPages);
}

function renderUserPaginationButtons(total) {
	const pagination = document.getElementById('paginationUser');
	pagination.innerHTML = '';

	const prev = document.createElement('li');
	prev.className = `page-item ${currentUserPage === 1 ? 'disabled' : ''}`;
	prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
	prev.onclick = (e) => {
		e.preventDefault();
		if (currentUserPage > 1) fetchUsers(currentUserPage - 1);
	};
	pagination.appendChild(prev);

	for (let i = 1; i <= total; i++) {
		const pageBtn = document.createElement('li');
		pageBtn.className = `page-item ${i === currentUserPage ? 'active' : ''}`;
		pageBtn.innerHTML = `<a class="page-link" href="#">${i}</a>`;
		pageBtn.onclick = (e) => {
			e.preventDefault();
			fetchUsers(i);
		};
		pagination.appendChild(pageBtn);
	}

	const next = document.createElement('li');
	next.className = `page-item ${currentUserPage === total ? 'disabled' : ''}`;
	next.innerHTML = `<a class="page-link" href="#">Next</a>`;
	next.onclick = (e) => {
		e.preventDefault();
		if (currentUserPage < total) fetchUsers(currentUserPage + 1);
	};
	pagination.appendChild(next);
}

document.getElementById('searchUser')?.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		currentUserPage = 1;
		fetchUsers();
	}
});

document.getElementById('sortUsersSelect')?.addEventListener('change', () => {
	currentUserPage = 1;
	fetchUsers();
});

function applyFiltersUser() {
	currentUserPage = 1;
	fetchUsers();
}



async function deletePost(id) {
	const result = await Swal.fire({
		title: 'Are you sure you want to delete this post?',
		text: 'You won\'t be able to revert this!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Yes, delete it!',
		cancelButtonText: 'Cancel'
	})

	if (result.isConfirmed) {
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
		body: JSON.stringify({ title, description })
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
		title: 'Are you sure you want to delete this user?',
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
		title: 'Are you sure you want to delete this page?',
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
		document.getElementById('edit-user-firstname').value = user.firstname
		document.getElementById('edit-user-lastname').value = user.lastname
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
		const tag = data.data[0]
		document.getElementById('edit-tag-id').value = tag._id
		document.getElementById('edit-tag-tagname').value = tag.tagName
		document.getElementById('edit-tag-description').value = tag.description
		document.getElementById('edit-tag-status').checked = tag.status

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

document.getElementById('editPostForm').addEventListener('submit', function (e) {
	e.preventDefault()
	const id = document.getElementById('edit-post-id').value
	updatePost(id)
})

document.getElementById('editTagForm').addEventListener('submit', function (e) {
	e.preventDefault()
	const id = document.getElementById('edit-tag-id').value
	updateTag(id)
})

document.getElementById('editPageForm').addEventListener('submit', function (e) {
	e.preventDefault()
	const id = document.getElementById('edit-page-id').value
	updatePage(id)
})

document.getElementById('editUserForm').addEventListener('submit', function (e) {
	e.preventDefault()
	const id = document.getElementById('edit-user-id').value
	updateUser(id)
})

async function updatePost(id) {
	const title = document.getElementById('edit-post-title').value
	const description = document.getElementById('edit-post-description').value
	const status = document.getElementById('edit-post-status').checked

	const res = await fetch(`${baseUrl}/updatePost/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		},
		body: JSON.stringify({ title, description, status })
	})

	const data = await res.json()

	if (res.ok) {
		Swal.fire({
			icon: 'success',
			title: 'Update Post Successfully',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			fetchPost();
			$('#editModal').modal('hide');
		});
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

async function updateTag(id) {
	const tagName = document.getElementById('edit-tag-tagname').value
	const description = document.getElementById('edit-tag-description').value
	const status = document.getElementById('edit-tag-status').checked

	const res = await fetch(`${baseUrl}/updateTag/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		},
		body: JSON.stringify({ tagName, description, status })
	})

	const data = await res.json()

	if (res.ok) {
		Swal.fire({
			icon: 'success',
			title: 'Update Tag Successfully',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			fetchTags();
			$('#edittag').modal('hide');
		});
	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete tag: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}

}

async function updatePage(id) {
	const pageName = document.getElementById('edit-page-pagename').value
	const description = document.getElementById('edit-page-description').value
	const status = document.getElementById('edit-page-status').checked

	const res = await fetch(`${baseUrl}/updatePages/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		},
		body: JSON.stringify({ pageName, description, status })
	})

	const data = await res.json()

	if (res.ok) {
		Swal.fire({
			icon: 'success',
			title: 'Update Page Successfully',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			fetchPages();
			$('#editpage').modal('hide');
		});
	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete page: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}

}

async function updateUser(id) {
	const firstname = document.getElementById('edit-user-firstname').value
	const lastname = document.getElementById('edit-user-lastname').value
	const email = document.getElementById('edit-user-email').value
	const status = document.getElementById('edit-user-status').checked
	const admin = document.getElementById('edit-user-admin').checked

	const res = await fetch(`${baseUrl}/updateUser/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${access_Token}`
		},
		body: JSON.stringify({ firstname, lastname, email, status, admin })
	})

	const data = await res.json()

	if (res.ok) {
		Swal.fire({
			icon: 'success',
			title: 'Update User Successfully',
			text: data.message,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		}).then(() => {
			fetchUsers();
			$('#edituser').modal('hide');
		});
	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete user: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}

}

async function viewPost(id) {

	const res = await fetch(`${baseUrl}/viewPostById/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	if (res.ok && data.success && data.data.length > 0) {
		const view = data.data[0]

		document.getElementById('view-post-id').innerHTML = `<strong>ID: </strong> <span> ${view._id} </span>`
		document.getElementById('view-post-title').innerHTML = `<strong>Title: </strong> <span> ${view.title} </span>`
		document.getElementById('view-post-description').innerHTML = `<strong>Description: </strong> <span> ${view.description} </span>`
		document.getElementById('view-post-status').innerHTML = `<strong>Status: </strong> <span> ${view.status ? 'Published' : 'unPublished'} </span>`
		document.getElementById('view-post-createdAt').innerHTML = `<strong>CreatedAt: </strong> <span> ${new Date(view.createdAt).toISOString().split('T')[0]} </span>`
		document.getElementById('view-post-updatedAt').innerHTML = `<strong>UpdatedAt: </strong> <span> ${new Date(view.updatedAt).toISOString().split('T')[0]} </span>`
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

async function viewTag(id) {

	const res = await fetch(`${baseUrl}/viewTagById/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	if (res.ok && data.success && data.data.length > 0) {
		const view = data.data[0]

		document.getElementById('view-tag-id').innerHTML = `<strong>ID: </strong> <span> ${view._id} </span>`
		document.getElementById('view-tag-tagname').innerHTML = `<strong>Tag name: </strong> <span> ${view.tagName} </span>`
		document.getElementById('view-tag-description').innerHTML = `<strong>Description: </strong> <span> ${view.description} </span>`
		document.getElementById('view-tag-status').innerHTML = `<strong>Status: </strong> <span> ${view.status ? 'Active' : 'Inactive'} </span>`
		document.getElementById('view-tag-createdAt').innerHTML = `<strong>CreatedAt: </strong> <span> ${new Date(view.createdAt).toISOString().split('T')[0]} </span>`
		document.getElementById('view-tag-updatedAt').innerHTML = `<strong>UpdatedAt: </strong> <span> ${new Date(view.updatedAt).toISOString().split('T')[0]} </span>`
	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete tag: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}
}

async function viewPage(id) {

	const res = await fetch(`${baseUrl}/viewPagesById/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	if (res.ok && data.success && data.data.length > 0) {
		const view = data.data[0]

		document.getElementById('view-page-id').innerHTML = `<strong>ID: </strong> <span> ${view._id} </span>`
		document.getElementById('view-page-pagename').innerHTML = `<strong>Page name: </strong> <span> ${view.pageName} </span>`
		document.getElementById('view-page-description').innerHTML = `<strong>Description: </strong> <span> ${view.description} </span>`
		document.getElementById('view-page-status').innerHTML = `<strong>Status: </strong> <span> ${view.status ? 'Active' : 'Inactive'} </span>`
		document.getElementById('view-page-createdAt').innerHTML = `<strong>CreatedAt: </strong> <span> ${new Date(view.createdAt).toISOString().split('T')[0]} </span>`
		document.getElementById('view-page-updatedAt').innerHTML = `<strong>UpdatedAt: </strong> <span> ${new Date(view.updatedAt).toISOString().split('T')[0]} </span>`
	} else {
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete page: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}
}

async function viewUser(id) {

	const res = await fetch(`${baseUrl}/viewUserById/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		}
	})

	const data = await res.json()

	if (res.ok && data.success && data.data.length > 0) {
		const view = data.data[0]

		document.getElementById('view-user-id').innerHTML = `<strong>ID: </strong> <span> ${view._id} </span>`
		document.getElementById('view-user-firstname').innerHTML = `<strong>First name: </strong> <span> ${view.firstname} </span>`
		document.getElementById('view-user-lastname').innerHTML = `<strong>Last name: </strong> <span> ${view.lastname} </span>`
		document.getElementById('view-user-email').innerHTML = `<strong>Email: </strong> <span> ${view.email} </span>`
		const err = await res.json();
		Swal.fire({
			icon: 'error',
			title: `Failed to delete page: ${err.error || res.statusText}`,
			text: data.error,
			timer: 2000,
			showConfirmButton: false,
			timerProgressBar: true
		})
	}
}

function getSearchParamsAndCount() {
	
	const search = document.getElementById('searchInput').value.trim();
 	const status = document.getElementById('statusFilter')?.value || "";
  	const date = document.getElementById('date')?.value || "";
	
	countPost(search, status, date);
}

document.getElementById('searchInput').addEventListener('input', getSearchParamsAndCount);

document.getElementById('statusFilter').addEventListener('change', getSearchParamsAndCount);

document.getElementById('date').addEventListener('change', getSearchParamsAndCount);

async function countPost(search = "", status = "", date = "") {

	const queryParams = new URLSearchParams();

	if (search) queryParams.append("search", search);
	if (status) queryParams.append("status", status);
	if (date) queryParams.append("date", date);

	const res = await fetch(`${baseUrl}/countPost?${queryParams.toString()}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		},
	})

	const data = await res.json()

	const count = data.count

	document.getElementById('postCount').textContent = `No Of Count: ${count}`

}

function getSearchParamsAndCountUser() {
	const search = document.getElementById('searchUser').value.trim();

	countUser(search);
}

document.getElementById('searchUser').addEventListener('input', getSearchParamsAndCountUser);



async function countUser(search = "") {

	const queryParams = new URLSearchParams();

	if (search) queryParams.append("search", search);

	const res = await fetch(`${baseUrl}/countUser?${queryParams.toString()}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		},
	})

	const data = await res.json()

	const count = data.count

	document.getElementById('userCount').textContent = `No Of Count: ${count}`

}

function getSearchParamsAndCountPages() {
	const search = document.getElementById('searchPages').value.trim();

	countPages(search);
}

document.getElementById('searchPages').addEventListener('input', getSearchParamsAndCountPages);


async function countPages(search = "") {

	const queryParams = new URLSearchParams();

	if (search) queryParams.append("search", search);

	const res = await fetch(`${baseUrl}/countPages?${queryParams.toString()}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		},
	})

	const data = await res.json()

	const count = data.count

	document.getElementById('pageCount').textContent = `No Of Count: ${count}`

}

function getSearchParamsAndTag() {
	const search = document.getElementById('searchTag').value.trim();

	countTag(search);
}

document.getElementById('searchTag').addEventListener('input', getSearchParamsAndTag);


async function countTag(search = "") {
	const queryParams = new URLSearchParams();

	if (search) queryParams.append("search", search);

	const res = await fetch(`${baseUrl}/countTag?${queryParams.toString()}`, {
		method: 'GET',
		headers: {
			'Authorization': `${tokenType} ${access_Token}`
		},
	})

	const data = await res.json()

	const count = data.count

	document.getElementById('tagCount').textContent = `No Of Count: ${count}`

}
(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
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
})

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

const prefix = 'api/v1'
const baseUrl = `http://localhost:8000/${prefix}`

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


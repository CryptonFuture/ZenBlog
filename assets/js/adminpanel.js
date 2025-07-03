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


$(document).ready(
		$('#signin-signup-button').on('click', function()
		{
			var dialog = $('#signin-signup');
			if (dialog.hasClass("show"))
				dialog.removeClass("show")
			else
				dialog.addClass("show");
		})
	)
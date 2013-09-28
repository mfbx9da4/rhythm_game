$(document).ready(
		$('#edit_grid_button').on('click', function()
		{
			var edit_grid = $('#edit_grid');
			if (edit_grid.hasClass("show"))
				edit_grid.removeClass("show");
			else
				edit_grid.addClass("show");
		})
	)
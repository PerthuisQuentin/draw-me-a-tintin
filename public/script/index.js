document.addEventListener("DOMContentLoaded", function() {

	var searchInput = document.getElementById("author-search");
	var imagePreview = $('.imagepreview');

	var imageHeader = document.getElementsByClassName("image-container-header")[0];
	var images = document.getElementsByClassName("image-container");
	var resources = document.getElementsByClassName("resource-container");

	var imagesContainer = document.getElementById("images");
	var resourcesContainer = document.getElementById("resources");
	var imagesButton = document.getElementById("images-button");
	var resourcesButton = document.getElementById("resources-button");

	var currentDisplay = "images";

	// Modal
	
	$('.modalable').on('click', function() {
		$('.imagepreview').attr('src', $(this).find('.image').attr('src'));
		$('#modal-info #name').text($(this).find('#name').text());
		$('#modal-info #author').text($(this).find('#author').text());
		$('#modal-info #date').text($(this).find('#date').text());
		$('#imagemodal').modal('show');   
	});

	// Filter

	function filterPicture(search) {
		var search = searchInput.value.toLowerCase();
		var items;
		if(currentDisplay == "images") {
			items = images;
		} else if(currentDisplay == "resources") {
			items = resources;
		}

		if(search == "") {
			for(var i = 0; i < items.length; i++) {
				items[i].style.display = "block";
			}
		} else {
			for(var i = 0; i < items.length; i++) {
				if(items[i].getAttribute("author").toLowerCase().indexOf(search) !== -1) {
					items[i].style.display = "block";
				} else {
					items[i].style.display = "none";
				}
			}
		}
	}

	searchInput.addEventListener("input", filterPicture); 

	// Switch

	imagesButton.addEventListener("click", function(e) {
		imagesButton.className = "active";
		resourcesButton.className = "";
		imagesContainer.style.display = "flex";
		resourcesContainer.style.display = "none";
		currentDisplay = "images";
	});

	resourcesButton.addEventListener("click", function(e) {
		imagesButton.className = "";
		resourcesButton.className = "active";
		imagesContainer.style.display = "none";
		resourcesContainer.style.display = "flex";
		currentDisplay = "resources";
	});
});
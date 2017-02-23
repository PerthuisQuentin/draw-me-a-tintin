document.addEventListener("DOMContentLoaded", function() {

	var modal = document.getElementById("images-modal");
	var modalImg = document.getElementById("modal-image");
	var searchInput = document.getElementById("author-search");

	var images = document.getElementsByClassName("image-container");
	var imageHeader = document.getElementsByClassName("image-container-header")[0];
	var modalCloseButton = document.getElementsByClassName("close")[0];

	function closeModal() {
		modal.style.display = "none";
	}

	modalCloseButton.addEventListener("click", closeModal);



	function openModal() {
		modal.style.display = "block";
	 	modalImg.src = this.getElementsByClassName("image")[0].src
	}

	for(var i = 0; i < images.length; i++) {
		images[i].addEventListener("click", openModal, true);
	}

	imageHeader.addEventListener("click", openModal, true);



	function filterPicture(search) {
		if(search == "") {
			for(var i = 0; i < images.length; i++) {
				images[i].style.display = "block";
			}
		} else {
			for(var i = 0; i < images.length; i++) {
				if(images[i].getAttribute("author") == search) {
					images[i].style.display = "block";
				} else {
					images[i].style.display = "none";
				}
			}
		}
	}

	searchInput.addEventListener("keypress", function(e) {
		if(e.keyCode === 13) filterPicture(searchInput.value);
	}); 
});
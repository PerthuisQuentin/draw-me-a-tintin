document.addEventListener("DOMContentLoaded", function() {

	var modal = document.getElementById("images-modal");
	var modalImg = document.getElementById("modal-image");

	var images = document.getElementsByClassName("image-container");
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

});
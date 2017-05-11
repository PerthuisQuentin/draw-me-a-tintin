document.addEventListener("DOMContentLoaded", function() {

	var imagesModal = $("#images-modal");
	var modalImage = imagesModal.find("#images-modal-image");

	var images = document.getElementsByClassName("image-container");

	$(".image-container").click(function(e) {
		modalImage.attr('src', $(this).find('.image').attr('src'));
		imagesModal.modal('show');
	});

	imagesModal.find(".images-modal-content").click(function(e) {
		if(e.target == this) {
			imagesModal.modal('hide');
		}
	});
});
document.addEventListener("DOMContentLoaded", function() {

    function getFormGroup(groupName) {
        return {
            group: $("#" + groupName + "-group"),
            input: $("#" + groupName + "-input"),
            helper: $("#" + groupName + "-helper"),
            feedback: $("#" + groupName + "-feedback"),
            status: $("#" + groupName + "-status")
        };
    }
    
    var mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var signupForm = $("#signup-form");

    var emailForm = getFormGroup("email");
    var usernameForm = getFormGroup("username");
    var passwordForm = getFormGroup("password");
    var confirmPasswordForm = getFormGroup("confirm-password");

    function toggleInputState(form, state) {
        switch(state) {
            case "success":
                form.group.removeClass("has-error");
                form.group.addClass("has-success");
                form.feedback.removeClass("glyphicon-remove sr-only");
                form.feedback.addClass("glyphicon-ok");
                form.status.text("(success)");
                break;
            case "error":
                form.group.removeClass("has-success");
                form.group.addClass("has-error");
                form.feedback.removeClass("glyphicon-ok sr-only");
                form.feedback.addClass("glyphicon-remove");
                form.status.text("(error)");
                break;
            case "none":
            default:
                form.group.removeClass("has-error has-success");
                form.feedback.removeClass("glyphicon-ok glyphicon-remove");
                form.feedback.addClass("sr-only");
                form.status.text("");
        }
    }

    emailForm.input.change(function() {
        if(emailForm.input.val() === "") {
            toggleInputState(emailForm, "none");
            emailForm.helper.addClass("sr-only");
            return;
        }

        if(mailRegex.test(emailForm.input.val())) {
            toggleInputState(emailForm, "success");
        } else {
            toggleInputState(emailForm, "error");
        }

        emailForm.helper.removeClass("sr-only");
    });

    usernameForm.input.change(function() {
        if(usernameForm.input.val() === "") {
            toggleInputState(usernameForm, "none");
            return;
        }

        var length = usernameForm.input.val().length;

        if(length > 2 && length < 32) {
            toggleInputState(usernameForm, "success");
        } else {
            toggleInputState(usernameForm, "error");
        }
    });

    passwordForm.input.change(function() {
        if(passwordForm.input.val() === "") {
            toggleInputState(usernameForm, "none");
            return;
        }

        var length = passwordForm.input.val().length;

        if(length > 7 && length < 128) {
            toggleInputState(passwordForm, "success");
        } else {
            toggleInputState(passwordForm, "error");
        }
    });

    confirmPasswordForm.input.change(function() {
        if(confirmPasswordForm.input.val() === "") {
            toggleInputState(usernameForm, "none");
            return;
        }

        var length = confirmPasswordForm.input.val().length;

        if(length > 7 && length < 128 && passwordForm.input.val() === confirmPasswordForm.input.val()) {
            toggleInputState(confirmPasswordForm, "success");
        } else {
            toggleInputState(confirmPasswordForm, "error");
        }
    });

	signupForm.submit(function() {

        console.log(this);

        // if(!mailRegex.test(emailForm.input.val())) {
        //     return false;
        // }

        confirmPasswordForm.input.prop('disabled', true);

        return true;
    });
});
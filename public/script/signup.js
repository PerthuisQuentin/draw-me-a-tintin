document.addEventListener("DOMContentLoaded", function() {

    var USERNAME_MIN_LENGTH = 3;
    var USERNAME_MAX_LENGTH = 32;
    var PASSWORD_MIN_LENGTH = 8;
    var PASSWORD_MAX_LENGTH = 256;

    var mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;    
    var usernameRegex = /^[a-zA-Z0-9_]*$/;

    var forms = {
        email: {
            group: $("#email-group"),
            input: $("#email-input"),
            helpers: {
                email: $("#email-email-helper"),
                availability: $("#email-availability-helper")
            },
            feedback: $("#email-feedback"),
            availability: $("#email-availability-error"),
            status: $("#email-status"),
            state: false
        },
        username: {
            group: $("#username-group"),
            input: $("#username-input"),
            helpers: {
                alphanumeric: $("#username-alphanumeric-helper"),
                min: $("#username-min-helper"),
                max: $("#username-max-helper"),
                availability: $("#username-availability-helper")
            },
            feedback: $("#username-feedback"),
            availability: $("#username-availability-error"),
            status: $("#username-status"),
            state: false
        },
        password: {
            group: $("#password-group"),
            input: $("#password-input"),
            helpers: {
                min: $("#password-min-helper"),
                max: $("#password-max-helper")
            },
            feedback: $("#password-feedback"),
            status: $("#password-status"),
            state: false
        },
        confirmPassword: {
            group: $("#confirm-password-group"),
            input: $("#confirm-password-input"),
            helpers: {
                equality: $("#confirm-password-equality-helper"),
                min: $("#confirm-password-min-helper"),
                max: $("#confirm-password-max-helper")
            },
            feedback: $("#confirm-password-feedback"),
            status: $("#confirm-password-status"),
            state: false
        }
    };
    
    var signupForm = $("#signup-form");

    function toggleInputState(form, state) {
        switch(state) {
            case "success":
                form.group.removeClass("has-error");
                form.group.addClass("has-success");
                form.feedback.removeClass("glyphicon-remove sr-only");
                form.feedback.addClass("glyphicon-ok");
                form.status.text("(success)");
                form.state = true;
                break;
            case "error":
                form.group.removeClass("has-success");
                form.group.addClass("has-error");
                form.feedback.removeClass("glyphicon-ok sr-only");
                form.feedback.addClass("glyphicon-remove");
                form.status.text("(error)");
                form.state = false;
                break;
            case "none":
            default:
                form.group.removeClass("has-error has-success");
                form.feedback.removeClass("glyphicon-ok glyphicon-remove");
                form.feedback.addClass("sr-only");
                form.status.text("");
                form.state = false;
        }
    }

    function hideHelpers(form) {
        for(var i in form.helpers) {
            form.helpers[i].addClass("sr-only");
        }
    }

    function showHelper(form, helper) {
        hideHelpers(form);
        form.helpers[helper].removeClass("sr-only");
    }

    forms.email.input.change(function() {
        var inputValue = forms.email.input.val();

        if(inputValue === "") {
            toggleInputState(forms.email, "none");
            hideHelpers(forms.email);
            return;
        }

        if(!mailRegex.test(inputValue)) {
            toggleInputState(forms.email, "error");
            showHelper(forms.email, "email");
        } else {
            toggleInputState(forms.email, "success");
            hideHelpers(forms.email);
        }
    });

    forms.username.input.change(function() {
        var inputValue = forms.username.input.val();

        if(inputValue === "") {
            toggleInputState(forms.username, "none");
            hideHelpers(forms.username);
            return;
        }

        var inputLength = inputValue.length;

        if(inputLength < USERNAME_MIN_LENGTH) {
            toggleInputState(forms.username, "error");
            showHelper(forms.username, "min");
        } else if(inputLength > USERNAME_MAX_LENGTH) {
            toggleInputState(forms.username, "error");
            showHelper(forms.username, "max");
        } else if(!usernameRegex.test(inputValue)) {
            toggleInputState(forms.username, "error");
            showHelper(forms.username, "alphanumeric");
        } else {
            toggleInputState(forms.username, "success");
            hideHelpers(forms.username);
        }
    });

    forms.password.input.change(function() {
        var inputValue = forms.password.input.val();

        if(inputValue === "") {
            toggleInputState(forms.password, "none");
            hideHelpers(forms.password);
            return;
        }

        var inputLength = inputValue.length;

        if(inputLength < PASSWORD_MIN_LENGTH) {
            toggleInputState(forms.password, "error");
            showHelper(forms.password, "min");
        } else if(inputLength > PASSWORD_MAX_LENGTH) {
            toggleInputState(forms.password, "error");
            showHelper(forms.password, "max");
        } else {
            toggleInputState(forms.password, "success");
            hideHelpers(forms.password);
        }

        forms.confirmPassword.input.change();
    });

    forms.confirmPassword.input.change(function() {
        var inputValue = forms.confirmPassword.input.val();

        if(inputValue === "") {
            toggleInputState(forms.confirmPassword, "none");
            hideHelpers(forms.confirmPassword);
            return;
        }

        var inputLength = inputValue.length;

        if(inputLength < PASSWORD_MIN_LENGTH) {
            toggleInputState(forms.confirmPassword, "error");
            showHelper(forms.confirmPassword, "min");
        } else if(inputLength > PASSWORD_MAX_LENGTH) {
            toggleInputState(forms.confirmPassword, "error");
            showHelper(forms.confirmPassword, "max");
        } else if(forms.password.input.val() !== inputValue) {
            toggleInputState(forms.confirmPassword, "error");
            showHelper(forms.confirmPassword, "equality");
        } else {
            toggleInputState(forms.confirmPassword, "success");
            hideHelpers(forms.confirmPassword);
        }
    });

    forms.email.input.change();
    forms.username.input.change();
    forms.password.input.change();
    forms.confirmPassword.input.change();

    if(forms.email.availability.length) {
        toggleInputState(forms.email, "error");
        showHelper(forms.email, "availability");
    }

    if(forms.username.availability.length) {      
        toggleInputState(forms.username, "error");
        showHelper(forms.username, "availability");
    }

	signupForm.submit(function() {

        // if(!mailRegex.test(emailForm.input.val())) {
        //     return false;
        // }

        // Don't send the confirmation password
        forms.confirmPassword.input.prop('disabled', true);

        return true;
    });
});
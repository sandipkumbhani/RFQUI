$(document).ready(function () {
   
    // Regex patterns
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var passwordPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    // Email validation on blur
    //$("#EmailId").on("blur", function () {
    //    var email = $(this).val().trim();
    //    if (!emailPattern.test(email)) {
    //        toastr.warning("Invalid Email Address.","Warning");
    //    }
    //});

    // Password validation on blur
    $("#Password").on("blur", function () {
        var password = $(this).val().trim();
        if (!passwordPattern.test(password)) {
            toastr.warning("Password Must be at least 6 Characters and Contain at least one Digit and One Uppercase letter.", "Warning");
        }
    });

    // Submit event
    $("#loginForm").submit(function (event) {
        event.preventDefault();
        $("#loginButton").prop("disabled", true).text("Logging in...");

        var loginid = $("#txtLoginName").val().trim();
        var password = $("#Password").val().trim();

        // Email validation
        //if (!emailPattern.test(email)) {
        //    toastr.error("Please Enter a valid Email Address.","Error");
        //    $("#loginButton").prop("disabled", false).text("Log In");
        //    return;
        //}

        // Password validation
        if (!passwordPattern.test(password)) {
            toastr.error("Password must be at least 6 characters and contain at least one digit One Uppercase letter.", "error");
            $("#loginButton").prop("disabled", false).text("Log In");
            return;
        }

        // Prepare data
        var formData = {
            LoginId: loginid,
            Password: password
        };

        // AJAX login call
        $.ajax({
            type: "POST",
            url: "/Login/GetToken",
            contentType: "application/json",
            data: JSON.stringify(formData),
            dataType: "json",
            headers: {
                "Accept": "application/json"
            },
            success: function (response) {
                console.log(response);
                if (response) {
                    sessionStorage.setItem("authToken", response.data);
                    window.location.href = window.location.origin + "/Dashboard/Dashboard";
                } else {
                    toastr.error("Invalid Email or Password.", "Error");
                }
            },
            error: function (xhr) {
                if (xhr.status === 400 && xhr.responseJSON) {
                    toastr.error(xhr.responseJSON.join("<br>"));
                } else if (xhr.status === 401) {
                    toastr.error("Invalid Email or Password.", "error");
                } else {
                    toastr.error("Server error. Please try again later.", "error");
                }
            },
            complete: function () {
                $("#loginButton").prop("disabled", false).text("Log In");
            }
        });
    });
    setupRememberMe("loginForm", "txtLoginName", "chkRememberMe", "/home");
});

function setupRememberMe(formId, usernameFieldId, checkboxId, redirectUrl) {
    const form = document.getElementById(formId);
    const usernameField = document.getElementById(usernameFieldId);
    const rememberCheckbox = document.getElementById(checkboxId);
    debugger;
    // Load saved username if exists
    if (localStorage.getItem("rememberMe") === "true") {
        usernameField.value = localStorage.getItem("username") || "";
        rememberCheckbox.checked = true;
    }

    // Handle form submit
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // prevent actual submit for demo

        if (rememberCheckbox.checked) {
            localStorage.setItem("username", usernameField.value);
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.removeItem("username");
            localStorage.setItem("rememberMe", "false");
        }
    });
}

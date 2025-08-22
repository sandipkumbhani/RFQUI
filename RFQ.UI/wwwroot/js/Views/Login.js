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

    $("#txtLoginName").on("blur", function () {
        var loginName = $(this).val().trim();
        if (IsNullOrEmpty(loginName) || !/^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/.test(loginName)) {
            toastr.warning("Invalid Login Name", "Warning");

        }
    });

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
    
        if (IsNullOrEmpty(loginid) || !/^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/.test(loginid)) {
            toastr.warning("Invalid Login Name", "Warning");
            return;
        }

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
                debugger;
                if (response != null && response.statusCode == 200) {
                    sessionStorage.setItem("authToken", response.data);
                    toastr.success(response.message, "success");
                    window.location.href = window.location.origin + "/Dashboard/Dashboard";
                } else {
                    toastr.warning(response.message, "warning");
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

    setupRememberMe();
});

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999; path=/";
}

function setupRememberMe() {
    const form = $("#loginForm");
    const usernameField = $("#txtLoginName");
    const passWordFiled = $("#Password");
    const rememberCheckbox = $("#chkRememberMe");

    // Load saved cookies if exist
    if (getCookie("rememberMe") === "true") {
        usernameField.val(getCookie("username") || "");
        passWordFiled.val(getCookie("passWord") || "");
        rememberCheckbox.prop("checked", true);
    }

    // Handle form submit
    form.on("submit", function () {
        if (rememberCheckbox.is(":checked")) {
            setCookie("username", usernameField.val(), 7);   // store for 7 days
            setCookie("passWord", passWordFiled.val(), 7);
            setCookie("rememberMe", "true", 7);
        } else {
            eraseCookie("username");
            eraseCookie("passWord");
            setCookie("rememberMe", "false", 7);
        }
    });
}


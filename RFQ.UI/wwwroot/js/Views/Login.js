
$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Disable the submit button to prevent multiple clicks
        $("#loginButton").prop("disabled", true).text("Logging in...");
        // var formData = {
        //     emailId: $("#EmailId").val(),
        //     password: $("#Password").val()
        // };

        var email = $("#EmailId").val().trim();
        var password = $("#Password").val().trim();
        var passwordPattern = /^(?=.*\d).{6,}$/;
        var emailPattern = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/";
        // // Frontend validation
        // if (!isValidateEmail.test(email))
        // {
        //     toastr.warning("Please enter a valid email address.");
        //     $("#loginButton").prop("disabled", false).text("Login");
        //     return;
        // }
        // if (!passwordPattern.test(password)) 
        // {
        //     toastr.warning("Password must be at least 6 characters and contain a number.");
        //     $("#loginButton").prop("disabled", false).text("Login");
        //     return;
        // }

        // $("#txtEmailid").on("blur", function ()
        // {
        //     var emailid = $(this).val();
        //     if (!isValidateEmail(emailid))
        //     {
        //         $("#EmailId").val('');
        //         toastr.warning("Please enter a valid Email", "Validation Error");
        //         return;
        //     }
        // });
        // $("#txtPassword").on("blur", function ()
        // {
        //     var password = $(this).val();
        //     if (!/^(?=.*\d).{6,}$/.test(password))
        //     {
        //         $("#Password").val('');
        //         toastr.warning("Please enter a valid PASSWORD", "Validation Error");
        //         return;
        //     }
        // });

        if (!emailPattern.test(email)) {
            toastr.error("Please enter a valid email address.");
            $("#loginButton").prop("disabled", false).text("Login");
            return;
        }
        if (!passwordPattern.test(password)) {
            toastr.error("Password must be at least 6 characters and contain a number.");
            $("#loginButton").prop("disabled", false).text("Login");
            return;
        }

        var formData = {
            emailId: email,
            password: password
        };

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
                if (response && response.token) {
                    sessionStorage.setItem("authToken", response.data);
                    window.location.href = window.location.origin + "/Dashboard/Dashboard";
                }
                else {
                    toastr.error("Invalid username or password.");
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 400 && xhr.responseJSON) {
                    toastr.error(xhr.responseJSON.join("<br>")); // for model validation messages
                }
                else if (xhr.status === 401) {
                    toastr.error("Invalid username or password.");
                }
                else {
                    toastr.error("Server error. Please try again later.");
                }
            },
            complete: function () {
                // Re-enable the submit button
                $("#loginButton").prop("disabled", false).text("Login");
            }
        });
    });
});

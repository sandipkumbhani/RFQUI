// verify-otp.js
$(document).ready(function () {
    OnSubmit();
});

function OnSubmit() {
    $('#BtnCreateNew').on('click', function (e) {
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        const email = params.get("email");

        var UserViewModel = {
            Password: newPassword,
            Emailid: email,
        }

        var UpdatePassWordUrl = '/User/UpdateUserPassword';
        $.ajax({
            type: "post",
            url: UpdatePassWordUrl,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(UserViewModel),
            dataType: "json",
            success: function (result) {
                toastr.success("Successfully Update User Password");
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update User Password", "Error");
            }
        });
    });
}

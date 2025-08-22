var passwordPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
var user = [];
$(document).ready(function () {
    var userid = getCookieValue('userid');
    var newPassword = $("#txtNewPassword").val()
    var txtReTypePassword = $("#txtReTypePassword").val();

    if (!IsNullOrEmpty(userid)) {
        userid = parseInt(userid);
    }
    getUserById(userid);
    Initialization();
});
function Initialization() {
    $("#txtNewPassword").on("blur", function () {
        const Password = $(this).val().trim();
        if (!passwordPattern.test(Password)) {
            toastr.warning("new Password must be at least 6 characters and contain at least one digit One Uppercase letter.", "warning");
            return;
        };
    });

    $("#txtReTypePassword").on("blur", function () {
        const Password = $(this).val().trim();
        if (!passwordPattern.test(Password)) {
            toastr.warning("ReType Password must be at least 6 characters and contain at least one digit One Uppercase letter.", "warning");
            return;
        };
    });

    $("#btnSaveChangePass").on('click', function () {
        OnSubmit();
    });
};
function getUserById(userId) {
    $.ajax({
        url: '/User/GetUserById',
        type: 'GET',
        data: { UserId: userId },
        success: function (response) {
            user = response;
            $('#txtCurrentPassword').val(response.password);
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}
function CheckValidation() {

    // Password validation
    var newPassword = $("#txtNewPassword").val()
    if (!passwordPattern.test(newPassword)) {
        toastr.warning("newPassword must be at least 6 characters and contain at least one digit One Uppercase letter.", "warning");
        return false;
    }
    var txtReTypePassword = $("#txtReTypePassword").val();
    if (!passwordPattern.test(txtReTypePassword)) {
        toastr.warning("txtReTypePassword must be at least 6 characters and contain at least one digit One Uppercase letter.", "warning");
        return false;
    }
    return true;
}

function OnSubmit() {

    if (!CheckValidation()) {
        return;
    }

    const newPassword = $('#txtNewPassword').val();
    const reTypePassword = $('#txtReTypePassword').val();

    if (newPassword !== reTypePassword) {
        toastr.warning("Passwords do not match.", "warning");
        return;
    }

    var UserViewModel = {
        Password: newPassword,
        LoginId: user.loginId,
    }

    var UpdatePassWordUrl = '/User/UpdateUserPassword';
    $.ajax({
        type: "post",
        url: UpdatePassWordUrl,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(UserViewModel),
        dataType: "json",
        success: function (result) {
            if (result) {
                toastr.success("Successfully Update User Password", "success");
            }
            else
                toastr.error("Somthing Went Wrong Contact Administrator", "Error");
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Update User Password Password", "Error");
        },
        complete: function () {
            $("#changeTypeForm")[0].reset();
        }
    });
}
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
    $("#txtCurrentPassword").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please Enter your Current Password!", "Warning");
            return;
        }
    });

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
            //$('#txtCurrentPassword').val(response.password);
        },
        error: function (xhr, status, error) {
            toastr.error("User not Exists!","Error");
        }
    });
}
function CheckValidation() {
    $("#txtCurrentPassword").on("blur", function () {
        if (IsNullOrEmpty($("#txtCurrentPassword").val())) {
            toastr.warning("Please Enter your Current Password!", "Warning");
            return false;
        }
    });
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
    var CurrentPassword = $("#txtCurrentPassword").val();
    if (!IsNullOrEmpty(CurrentPassword) && CurrentPassword != user.password) { 
        toastr.warning("Invalid CurrentPassword", "CurrentPasswordg");
        return false;

    }
    return true;
}
function OnSubmit() {
    var userid = getCookieValue('userid');
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
        UserId: parseInt(userid),
        //LoginId: user.LoginId,
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
                $('#successCard').removeClass('d-none');
                $('#formDiv').addClass('d-none');
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
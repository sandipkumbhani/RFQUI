var user = [];

$(document).ready(function () {
    Initialization();
});
function Initialization() {
    $("#txtLoginName").on("blur", function () {
        var loginName = $(this).val().trim();
        if (IsNullOrEmpty(loginName) || !/^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/.test(loginName)){
            toastr.warning("Invalid Login Name", "Warning");
        }
    });

    $("#btnSaveReset").on('click', function () {
        getUserByLoginId();
    });
};
function getUserByLoginId() {
    var loginName = $("#txtLoginName").val().trim();
    $.ajax({
        url: '/Login/GetByLoginIdAsync',
        type: 'GET',
        data: { txtLoginName: loginName },
        success: function (response) {
            if (response.statusCode === 200) {
                user = response.data;
                UpdateUserPassword();
            } else {
                toastr.error(response.message);
            }
        },
        error: function (xhr) {
            toastr.error("User not Exists!", "Error");
        }
    });
}
function generatePassword(length = 10) {
    if (length < 6) length = 6; // enforce minimum length
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const allChars = upper + lower + digits;

    // Ensure at least one uppercase and one digit
    let password = "";
    password += upper.charAt(Math.floor(Math.random() * upper.length));
    password += digits.charAt(Math.floor(Math.random() * digits.length));

    // Fill the rest with random characters
    for (let i = 2; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password characters
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
}
function UpdateUserPassword() {
    var newPassword = generatePassword();
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
                user.password = newPassword;
                sendNewPassword();
                toastr.success("Successfully Update User Password", "success");
            }
            else
                toastr.error("Somthing Went Wrong Contact Administrator", "Error");
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Update User Password Password", "Error");
        },
        complete: function () {
            $("#resetPasswordForm")[0].reset();
        }
    });
}
function sendNewPassword() {
    $.ajax({
        url: '/Login/SendNewPassword',
        type: 'GET',   // because your API is GET
        data: {
            emailId: user.emailId,
            newPassword: user.password
        },
        success: function (response) {

            if (response.statusCode === 200) {
                toastr.success(response.message, "Success");
            } else {
                toastr.error(response.message, "Error");
            }
        },
        error: function (xhr) {
            toastr.error("Something went wrong", "Error");
        }
    });
}

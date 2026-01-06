$(document).ready(function () {
    OnSubmit();
});
function OnSubmit() {
    $('#BtnCreateNew').on('click', function (e) {
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        if (newPassword !== confirmPassword) {
            toastr.warning("Passwords do not match.", "warning");
            return;
        }
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        const loginId = params.get("loginId");
        var UserViewModel = {
            Password: newPassword,
            LoginId: loginId,
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
                    window.location.href = '/Login/Login';
                }
                else
                    toastr.error("Somthing Went Wrong Contact Administrator", "Error");
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update User Password Password", "Error");
            }
        });
    });
}

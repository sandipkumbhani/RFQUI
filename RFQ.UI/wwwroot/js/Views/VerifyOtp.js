// verify-otp.js
$(document).ready(function () {
    OnSubmit();
});

function OnSubmit() {
    $('#continue').on('click',function (e) {
        e.preventDefault();
        
        const otp = $('#otp0').val() + $('#otp1').val() + $('#otp2').val() + $('#otp3').val()
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        const email = params.get("email");

        $.post('/Login/VerifyOtp', { email, otp }, function (res) {
            if (res.success) {
                window.location.href = '/Login/SetNewPassword?email=' + encodeURIComponent(email);
            } else {
                toastr.error("Failed to Update User Password", "Error");
            }
        });
    });
}

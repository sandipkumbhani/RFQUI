// verify-otp.js
$(document).ready(function () {
    OnSubmit();
    ResendOtp();
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
function ResendOtp() {
    $('#btnResendOtp').submit(function (e) {
        e.preventDefault();

        const email = $('input[type="email"]').val();
        $.ajax({
            type: "POST",
            url: '/Login/SendOtp',
            data: { email },
            success: function (res) {
                if (res.success) {
                    toastr.success("OTP sent successfully!", "Success");
                } else {
                    toastr.error("Email not registered or OTP sending failed.", "Error");
                }
            },
            error: function () {
                toastr.error("Email not registered or OTP sending failed.", "Error");
            }
        });
    });
}

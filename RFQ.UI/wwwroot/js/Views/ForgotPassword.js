$(document).ready(function () {
    onSubmit();
})
function onSubmit() {
    $('.forgot-box').submit(function (e) {
        e.preventDefault();

        const email = $('input[type="email"]').val();
        $.ajax({
            type: "POST",
            url: '/Login/SendOtp',
            data: { email },
            success: function (res) {
                debugger;
                if (res.success) {
                    window.location.href = '/Login/Verification?email=' + encodeURIComponent(email);
                } else {
                    alert("Email not registered or OTP sending failed.");
                }
            },
            error: function () {
                alert("Error occurred while sending OTP.");
            }
        });
    });
}
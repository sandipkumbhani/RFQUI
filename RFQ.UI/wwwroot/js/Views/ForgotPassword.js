$(document).ready(function () {
    // Email validation on blur
    $("#EmailId").on("blur", function () {
        var emailid = $(this).val();
        if (!isValidateEmail(emailid)) {
            $("#EmailId").val('');
            toastr.warning("Please enter a valid Email", "Validation Error");
            return;
        }
    });

    // Handle form submit
    $('.forgot-box').on('submit', function (e) {
        e.preventDefault();

        const email = $('#EmailId').val().trim();
        if (!isValidateEmail(email)) {
            toastr.warning("Please Enter a valid Email", "Validation Error");
            return;
        }

        $.ajax({
            type: "POST",
            url: '/Login/SendOtp',
            data: { email },
            success: function (res) {
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
});

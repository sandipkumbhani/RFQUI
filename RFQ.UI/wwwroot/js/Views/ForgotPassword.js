$(document).ready(function () {

    $("#txtLoginName").on("blur", function () {
        var txtLoginName = $(this).val();
        if (IsNullOrEmpty(txtLoginName)) {
            toastr.warning("Please enter a Login User Name", "Validation Error");
            return;
        }
    });

    $('#continueButton').on('click', function (e) {
        e.preventDefault();
        const txtLoginName = $('#txtLoginName').val().trim();
        if (IsNullOrEmpty(txtLoginName)) {
            toastr.warning("Please enter a Login User Name", "Validation Error");
            return;
        }
        $("#continueButton").prop("disabled", true).text("Sending Otp..");
        $.ajax({
            type: "POST",
            url: '/Login/SendOtp',
            data: { txtLoginName },
            success: function (res) {
                if (res.statusCode == 200) {
                    window.location.href = '/Login/Verification?loginId=' + encodeURIComponent(res.data.loginId);
                } else {
                    $("#continueButton").prop("disabled", false);
                    toastr.warning(res.message,"warning");
                }
            },
            error: function () {
                $("#continueButton").prop("disabled", false);
                toastr.error("Error occurred while sending OTP.", "error");
            },
            complete: function () {
                $("#continueButton").prop("disabled", false);
            }
        });
    });
});

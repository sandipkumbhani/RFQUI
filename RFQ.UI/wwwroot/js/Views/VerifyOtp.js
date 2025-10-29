let countdownSeconds = 30;
let timerInterval;
$(document).ready(function () {
    initilization();
    startCountdown();
    OnSubmit();
    ResendOtp();
});
function initilization() {
    $('.verification-number input').on('input', function () {
        var $inputs = $('.verification-number input');
        var index = $inputs.index(this);
        if ($(this).val().length === 1) {
            // Move to next input if not the last one
            if (index < $inputs.length - 1) {
                $inputs.eq(index + 1).focus();
            }
        }
    });

    // Optional: handle backspace to move focus to previous input
    $('.verification-number input').on('keydown', function (e) {
        var $inputs = $('.verification-number input');
        var index = $inputs.index(this);
        if (e.key === 'Backspace' && $(this).val() === '') {
            if (index > 0) {
                $inputs.eq(index - 1).focus();
            }
        }
    });
}
function OnSubmit() {
    $('#continue').on('click',function (e) {
        e.preventDefault();
        const otp = $('#otp0').val() + $('#otp1').val() + $('#otp2').val() + $('#otp3').val();
        if (otp == null || otp == "") {
            toastr.warning("Please Enter Otp!", "Warning");
            return;
        }
        if ($(".verification-time span").text().trim() === "00:00") {
            toastr.error("Invalid Otp!", "Error");
            return;
        }
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        const loginId = params.get("loginId");
        if(otp)
        $.post('/Login/VerifyOtp', { loginId, otp }, function (res) {
            if (res.success) {
                window.location.href = '/Login/SetNewPassword?loginId=' + encodeURIComponent(loginId);
            } else {
                toastr.error("Invalid otp!", "Error");
            }
        });
    });
}
function ResendOtp() {
    $('#btnResendOtp').on('click',function (e) {
        e.preventDefault();
        const txtLoginName = GetQueryParam("loginId");
        $.ajax({
            type: "POST",
            url: '/Login/SendOtp',
            data: { txtLoginName },
            success: function (res) {
                if (res.statusCode == 200) {
                    toastr.success("OTP sent successfully!", "Success");
                    countdownSeconds = 30;
                    startCountdown();
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
function startCountdown() {
    document.querySelector('.verification-time span').innerText = "00:60";

    timerInterval = setInterval(() => {
        if (countdownSeconds > 0) {
            countdownSeconds--;
            // Format the time as MM:SS
            let minutes = Math.floor(countdownSeconds / 60);
            let seconds = countdownSeconds % 60;
            let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.querySelector('.verification-time span').innerText = formattedTime;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
}


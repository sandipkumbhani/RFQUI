using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Models;

namespace RFQ.UI.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILoginServices _loginServcies;
        private readonly ILogger<LoginController> _logger;
        private static Dictionary<string, string> otpStore = new();

        public LoginController(ILoginServices loginServcies, ILogger<LoginController> logger)
        {
            _loginServcies = loginServcies;
            _logger = logger;
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult ForgotPassword()
        {
            return View();
        }
        public IActionResult Verification()
        {
            return View();
        }
        public IActionResult SetNewPassword()
        {
            return View();
        }
        public IActionResult Signup()
        {
            return View("~/Views/Login/sign-up.cshtml");
        }

        [HttpPost]
        public async Task<string> GetToken([FromBody] LoginDto input)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var tokenstring = await _loginServcies.Login(input);

                    if (!string.IsNullOrEmpty(tokenstring))
                    {
                        Response.Cookies.Append("AuthToken", tokenstring);
                    }
                    return tokenstring;
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError(" Error -------------------- " + ex.Message);
                _logger.LogInformation("--------------------------------");
                _logger.LogInformation(ex.StackTrace);
                _logger.LogInformation("--------------------------------");
                throw;
            }

        }

        [HttpPost]
        public JsonResult SendOtp(string email)
        {
            // Validate email exists (dummy check)
            if (string.IsNullOrEmpty(email)) return Json(new { success = false });

            // Generate OTP
            var otp = new Random().Next(1000, 9999).ToString();

            // Store OTP
            otpStore[email] = otp;

            // Send OTP via email (dummy log, replace with actual mail code)
            System.Diagnostics.Debug.WriteLine($"OTP for {email}: {otp}");

            return Json(new { success = true });
        }

        [HttpPost]
        public JsonResult VerifyOtp(string email, string otp)
        {
            if (otpStore.ContainsKey(email) && otpStore[email] == otp)
            {
                // OTP verified
                otpStore.Remove(email); // clear OTP after use
                return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        public ActionResult ResetPassword(string email)
        {
            // Show reset form (not implemented here)
            return Content($"Reset password for: {email}");
        }
    }
}

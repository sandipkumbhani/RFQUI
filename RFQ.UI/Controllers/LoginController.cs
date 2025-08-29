using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Models;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using RFQ.UI.Application.Provider;
using System.Threading.Tasks;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILoginServices _loginServcies;
        private readonly ILogger<LoginController> _logger;
        private static Dictionary<string, string> otpStore = new();
        private readonly IUsersService _usersService;
        private readonly IWhatsAppService _whatsAppService;

        public LoginController(ILoginServices loginServcies, ILogger<LoginController> logger, IUsersService usersService, IWhatsAppService whatsAppService)
        {
            _loginServcies = loginServcies;
            _logger = logger;
            _usersService = usersService;
            _whatsAppService =
            _whatsAppService = whatsAppService;
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
        public IActionResult ResetPassword()
        {
            return View();
        }
        public IActionResult ChangePassword()
        {
            return View();
        }
        [HttpPost]
        public async Task<NewCommonResponseDto> GetToken([FromBody] LoginDto input)
        {
            NewCommonResponseDto response = new();
            try
            {
                if (ModelState.IsValid)
                {
                    response = await _loginServcies.Login(input);

                    if (response.Data != null && response.StatusCode == 200)
                    {
                        var handler = new JwtSecurityTokenHandler();
                        var jwtToken = handler.ReadJwtToken(response.Data.ToString());
                        var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                        var personname = jwtToken.Claims.FirstOrDefault(c => c.Type == "personname")?.Value;
                        var companyid = jwtToken.Claims.FirstOrDefault(c => c.Type == "companyid")?.Value;
                        var profileid = jwtToken.Claims.FirstOrDefault(c => c.Type == "profileid")?.Value;
                        var userid = jwtToken.Claims.FirstOrDefault(c => c.Type == "userid")?.Value;
                        var locationid = jwtToken.Claims.FirstOrDefault(c => c.Type == "locationid")?.Value;

                        if (!string.IsNullOrEmpty(email))
                            Response.Cookies.Append("UserEmail", email);

                        if (!string.IsNullOrEmpty(personname))
                            Response.Cookies.Append("PersonName", personname);

                        if (!string.IsNullOrEmpty(companyid))
                            Response.Cookies.Append("companyid", companyid);

                        if (!string.IsNullOrEmpty(profileid))
                            Response.Cookies.Append("profileid", profileid);

                        if (!string.IsNullOrEmpty(profileid))
                            Response.Cookies.Append("userid", userid);

                        if (!string.IsNullOrEmpty(locationid))
                            Response.Cookies.Append("locationid", locationid);

                        Response.Cookies.Append("AuthToken", response.Data.ToString());
                    }
                }
                return response;
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
        public async Task<IActionResult> SendOtp(string txtLoginName)
        {

            try
            {
                UserResponseDto user = new();
                // Validate email exists (dummy check)
                if (string.IsNullOrEmpty(txtLoginName)) return Ok(user);
                else
                    user = await _usersService.GetByLoginIdAsync(txtLoginName);

                if (user != null)
                {
                    // Generate OTP
                    var otp = new Random().Next(1000, 9999).ToString();

                    // Store OTP
                    otpStore[user.LoginId] = otp;

                    // Prepare email
                    var subject = "Your OTP Code";
                    string body = "";
                    body += "Dear User,\n\n";
                    body += "We received a request to verify your email address.\n\n";
                    body += $"Your One-Time Password (OTP) is: {otp}\n\n";
                    body += "Please enter this OTP in the application to complete your verification.\n\n";
                    body += "If you did not request this, you can safely ignore this email.\n\n";
                    body += "Thank you,\n";
                    body += "FleetLynk";


                    var smtpClient = new SmtpClient("smtp.gmail.com")
                    {
                        Port = 587,
                        Credentials = new NetworkCredential("amit.dev1018@gmail.com", "fqrf srsh rllg cpwl"), // <-- App password here
                        EnableSsl = true,
                    };

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("amit.dev1018@gmail.com", "FleetLynk"),  // your Gmail address
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = false
                    };
                    mailMessage.To.Add(user.EmailId);

                    smtpClient.Send(mailMessage);

                    return Ok(new NewCommonResponseDto
                    {
                        Data = user,
                        StatusCode = 200,
                        Message = "Successfully sent OTP"
                    });
                }
                else
                {
                    return Ok(new NewCommonResponseDto
                    {
                        Data = null,
                        StatusCode = 404,
                        Message = "User Not Found - Failed to send OTP"
                    });
                }
            }
            catch (Exception ex)
            {
                return NotFound(new NewCommonResponseDto
                {
                    Data = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost]
        public JsonResult VerifyOtp(string loginId, string otp)
        {
            if (otpStore.ContainsKey(loginId) && otpStore[loginId] == otp)
            {
                // OTP verified
                otpStore.Remove(loginId); // clear OTP after use
                return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        [HttpGet("Login/GetByLoginIdAsync")]
        public async Task<IActionResult> GetByLoginIdAsync([FromQuery] string txtLoginName)
        {
            try
            {
                var user = await _usersService.GetByLoginIdAsync(txtLoginName);

                if (user == null)
                {
                    return NotFound(new NewCommonResponseDto
                    {
                        Data = null,
                        StatusCode = 404,
                        Message = "User not found"
                    });
                }

                return Ok(new NewCommonResponseDto
                {
                    Data = user,
                    StatusCode = 200,
                    Message = "User found"
                });
            }
            catch (Exception ex)
            {
                // Log exception here
                return StatusCode(500, new NewCommonResponseDto
                {
                    Data = null,
                    StatusCode = 500,
                    Message = "An error occurred while processing the request.",
                    ErrorMessage = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpGet("Login/SendNewPassword")]
        public async Task<IActionResult> SendNewPassword(string emailId, string newPassword)
        {
            UserResponseDto user = new();

            // Validate user exists
            if (string.IsNullOrEmpty(emailId))
                return Ok(new NewCommonResponseDto { Data = null, StatusCode = 404, Message = "Invalid login name" });

            if (string.IsNullOrEmpty(newPassword))
                return Ok(new NewCommonResponseDto { Data = null, StatusCode = 404, Message = "newPassword not found or email missing" });

            // Prepare email
            var subject = "Your New Password";
            string body = "";
            body += "Dear User,\n\n";
            body += "We have reset your password as requested.\n\n";
            body += $"Your new password is: {newPassword}\n\n";
            body += "Please log in using this password and change it immediately.\n\n";
            body += "Thank you,\n";
            body += "FleetLynk";

            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("amit.dev1018@gmail.com", "fqrf srsh rllg cpwl"), // <-- Gmail App password
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("amit.dev1018@gmail.com", "FleetLynk"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(emailId);

                smtpClient.Send(mailMessage);

                return Ok(new NewCommonResponseDto() { Data = user, StatusCode = 200, Message = "New password sent successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Failed to send email", error = ex.Message });
            }
        }

    }
}

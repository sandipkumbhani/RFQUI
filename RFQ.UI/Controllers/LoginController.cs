using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Models;

namespace RFQ.UI.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILoginServices _loginServcies;
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILoginServices loginServcies, ILogger<LoginController> logger)
        {
            _loginServcies = loginServcies;
            _logger = logger;
        }
        public IActionResult Login()
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
    }
}

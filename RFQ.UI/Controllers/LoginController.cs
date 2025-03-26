using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Models;

namespace RFQ.UI.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILoginServices _loginServcies;

        public LoginController(ILoginServices loginServcies)
        {
            _loginServcies = loginServcies;
        }
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Signup()
        {
            return View("~/Views/Login/sign-up.cshtml");
        }

        public async Task<string> GetToken([FromBody] LoginDto input)
        {
            if (ModelState.IsValid)
            {
                LoginViewModel model = new LoginViewModel
                {
                    EmailId = input.emailId,
                    Password = input.password
                };

                var tokenstring = await _loginServcies.Login(model);

                if (!string.IsNullOrEmpty(tokenstring))
                {
                    Response.Cookies.Append("AuthToken", tokenstring);
                }
                return tokenstring;
            }
            return string.Empty;

        } 
    }
}

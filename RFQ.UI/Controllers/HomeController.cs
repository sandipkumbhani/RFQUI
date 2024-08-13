using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;
using System.Diagnostics;

namespace RFQ.UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILoginServcies _loginServcies;
        private readonly ILogger<HomeController> _logger;
        private readonly IDashboardServices _boardServices;

        public HomeController(ILogger<HomeController> logger, ILoginServcies loginServcies, IDashboardServices boardServices)
        {
            _loginServcies = loginServcies;
            _logger = logger;
            _boardServices = boardServices;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Franchise()
        {
            return View();
        }

        public IActionResult CompanyConfiguration()
        {
            return View();
        }

        public IActionResult OrganisationLocation()
        {
            return View();
        }

        public IActionResult Vendor()
        {
            return View();
        }


        public IActionResult Item()
        {
            return View();
        }

        public IActionResult Customer()
        {
            return View();
        }

        public IActionResult Vehicle()
        {
            return View();
        }
        public IActionResult CorporateCompany()
        {
            return View();
        }

        public IActionResult Profile()
        {
            return View();
        }

        public IActionResult ProfileRight()
        {
            return View();
        }

        public IActionResult user()
        {
            return View();
        }

        public IActionResult ResetPassword()
        {
            return View();
        }

        public IActionResult ChangePassword()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var tokenstring = await _loginServcies.Login(model);

                if (!string.IsNullOrEmpty(tokenstring))
                {
                    Response.Cookies.Append("AuthToken", tokenstring);
                }
                return RedirectToAction("Dashboard");
            }
            return View();

        }

        public async Task<IActionResult> Dashboard(DashboardViewModel dashboardViewModel)
        {
            try
            {
                var userlist = await _boardServices.GetAllUsers();
                if (userlist != null && userlist.Count() > 0)
                {
                    dashboardViewModel.CompanyUserDto.AddRange(userlist);
                }
                return View(dashboardViewModel);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
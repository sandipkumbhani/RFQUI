using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;
using System.Diagnostics;

namespace RFQ.UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILoginServices _loginServcies;
        private readonly IProfileServices _profileServices;
        private readonly IDashboardServices _boardServices;

        public HomeController(ILoginServices loginServcies, IDashboardServices boardServices, IProfileServices profileServices)
        {
            _loginServcies = loginServcies;
            _boardServices = boardServices;
            _profileServices = profileServices;
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

        [HttpPost]
        public IActionResult Profilesave([FromBody] ProfileViewModelDto profileViewModelDto)
        {
            if (profileViewModelDto != null)
            {
                var profile = new ProfileViewModelDto()
                {
                    ProfileName = profileViewModelDto.ProfileName,
                    CompanyTypeId = profileViewModelDto.CompanyTypeId,
                };
                var result = _profileServices.AddProfile(profile);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

            }
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

        public async Task<IActionResult> ViewProfile(ProfileViewModel profileViewModel)
        {
            try
            {
                var userlist = await _profileServices.GetProfileAll();
                if (userlist != null && userlist.Count() > 0)
                {
                    profileViewModel.profileViewModelDtos.AddRange(userlist);
                }
                var result = JsonConvert.SerializeObject(profileViewModel);
                return View(profileViewModel);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
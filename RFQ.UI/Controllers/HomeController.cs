using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;
using RFQ.UI.Models;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Controllers
{
    public class HomeController : Controller
    {


      
        private readonly GlobalClass _globalClass;
        private readonly IVehicletypeServices _vehicletypeServices;
        private readonly IMenuServices _menuServices;

        public HomeController(IMenuServices menuServices,  GlobalClass globalClass, IVehicletypeServices vehicletypeServices)
        {
            _globalClass = globalClass;
            _vehicletypeServices = vehicletypeServices;
            _menuServices = menuServices;
        }

        public IActionResult Index()
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

        public IActionResult CorporateCompany()
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

        public async Task<IActionResult> GetMenu(MenuViewModel menuViewModel)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var menulist = await _menuServices.GetMenu(profileID);
                if (menulist != null && menulist.Count() > 0)
                {
                    menuViewModel.menulistDtos.AddRange(menulist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(menuViewModel);
                }
                else
                {
                    return View(menuViewModel);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
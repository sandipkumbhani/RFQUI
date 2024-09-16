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
        private readonly ILoginServices _loginServcies;
        private readonly IProfileServices _profileServices;
        private readonly IDashboardServices _boardServices;
        private readonly GlobalClass _globalClass;
        private readonly IVehicletypeServices _vehicletypeServices;
        private readonly IMenuServices _menuServices;

        public HomeController(ILoginServices loginServcies, IMenuServices menuServices, IDashboardServices boardServices, IProfileServices profileServices, GlobalClass globalClass, IVehicletypeServices vehicletypeServices)
        {
            _loginServcies = loginServcies;
            _boardServices = boardServices;
            _profileServices = profileServices;
            _globalClass = globalClass;
            _vehicletypeServices = vehicletypeServices;
            _menuServices = menuServices;
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


        [HttpPost]
        public IActionResult Vehicletypesave([FromBody] VehicleTypeViewModelDto vehicleTypeViewModelDto)
        {
            if (vehicleTypeViewModelDto != null)
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;


                var Vehicle = new VehicleTypeViewModelDto()
                {
                    CompanyId = Convert.ToInt32(companyid),
                    VehicleTypeName = vehicleTypeViewModelDto.VehicleTypeName,
                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid)
                };
                var result = _vehicletypeServices.AddVehicleType(Vehicle);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });

            }
        }


        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileViewModelDto profileViewModelDto)
        {
            try
            {
                int profileId = profileViewModelDto.ProfileId;
                var result = await _profileServices.EditProfile(profileId, profileViewModelDto);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateVehicleType([FromBody] VehicleTypeViewModelDto vehicleTypeViewModelDto)
        {
            try
            {
                int vechicleTypeId = vehicleTypeViewModelDto.VechicleTypeId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                var vehicle = new VehicleTypeViewModelDto
                {
                    VehicleTypeName = vehicleTypeViewModelDto.VehicleTypeName,
                    CompanyId = Convert.ToInt32(companyid),
                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid)
                };
                var result = await _vehicletypeServices.EditVehicleType(vechicleTypeId, vehicle);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [Route("Home/DeleteProfile/{profileId}")]
        [HttpDelete("{profileId}")]
        public async Task<IActionResult> DeleteProfile(int profileId)
        {
            try
            {
                var result = await _profileServices.DeleteProfile(profileId);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [Route("Home/DeleteVehicleType/{vehicleTypeId}")]
        [HttpDelete("{vehicleTypeId}")]
        public async Task<IActionResult> DeleteVehicleType(int vehicleTypeId)
        {
            try
            {
                var result = await _vehicletypeServices.DeleteVehicleType(vehicleTypeId);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
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

        public async Task<IActionResult> ViewProfile(ProfileViewModel profileViewModel)
        {
            try
            {
                profileViewModel ??= new ProfileViewModel();
                var userlist = await _profileServices.GetProfileAll();
                if (userlist != null && userlist.Count() > 0)
                {
                    profileViewModel.profileViewModelDtos.AddRange(userlist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(profileViewModel); // Return JSON for AJAX requests
                }
                else
                {
                    return View(profileViewModel); // Return the view for normal requests
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IActionResult> ViewVehicleType(VehicleTypeViewModel vehicleTypeViewModel)
        {
            try
            {
                vehicleTypeViewModel ??= new VehicleTypeViewModel();
                var userlist = await _vehicletypeServices.GetVehicleTypeAll();
                if (userlist != null && userlist.Count() > 0)
                {
                    vehicleTypeViewModel.vehicleTypeViewModelDtos.AddRange(userlist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(vehicleTypeViewModel); // Return JSON for AJAX requests
                }
                else
                {
                    return View(vehicleTypeViewModel); // Return the view for normal requests
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;
using RFQ.UI.Models;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using static RFQ.UI.Domain.Model.DashboardViewModel;
using static RFQ.UI.Domain.Model.UserViewModel;
using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IVehicletypeServices _vehicletypeServices;
        private readonly IUsersService _usersService;
        private readonly IMenuServices _menuServices;
        public HomeController(IMenuServices menuServices,  GlobalClass globalClass, IVehicletypeServices vehicletypeServices,IUsersService usersService )
        {
            _globalClass = globalClass;
            _vehicletypeServices = vehicletypeServices;
            _usersService = usersService;
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
        [HttpPost]
        public IActionResult UserSave([FromBody] UserViewModelDto userViewModelDto)
        {
            if (userViewModelDto != null)
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                var User = new UserViewModelDto()
                {
                    CompanyId = Convert.ToInt32(companyid),
                    PersonName = userViewModelDto.PersonName,
                    MobileNo = userViewModelDto.MobileNo,
                    EmailId = userViewModelDto.EmailId,
                    LocationId = userViewModelDto.LocationId,
                    LoginId = userViewModelDto.LoginId,
                    Password = userViewModelDto.Password,
                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid),
                    ProfileId = Convert.ToInt32(profileid),

                };
                var result = _usersService.AddUsers(User);
                return Json(new { result = "success" });
            }
            else
            {
                return Json (new { result = "fail" });
            }
        }
        [HttpGet]
        public async Task<IActionResult> ViewUserList(UserViewModel userViewModel)
        {
            try
            {
                userViewModel ??= new UserViewModel();
                var userlist = await _usersService.GetAllUser();
                if (userlist != null && userlist.Count() > 0)
                {
                    userViewModel.userViewModelDtos.AddRange(userlist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(userViewModel);
                }
                else
                {
                    return Json(userViewModel);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        [HttpPut]
        public async Task<IActionResult> EditUserList([FromBody] UserViewModelDto userViewModelDto)
        {
            try
            {
                int userId = userViewModelDto.UserId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                var user = new UserViewModelDto()
                {
                    UserId = userViewModelDto.UserId,
                    CompanyId = Convert.ToInt32(companyid),
                    PersonName = userViewModelDto.PersonName,
                    MobileNo = userViewModelDto.MobileNo,   
                    EmailId = userViewModelDto.EmailId,
                    LocationId = userViewModelDto.LocationId,
                    LoginId = userViewModelDto.LoginId,
                    Password = userViewModelDto.Password,
                    CreatedBy = Convert.ToInt32(profileid),
                    UpdatedBy = Convert.ToInt32(profileid),
                    ProfileId = Convert.ToInt32(profileid),
                };
                var result = await _usersService.EditUsers(userId, user);
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
        [HttpDelete("Home/DeleteUserList/{UserId}")]
        public async Task<IActionResult> DeleteUserList(int UserId)
        {
            try
            {
                var result = await _usersService.DeleteUsers(UserId);
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
        public IActionResult ResetPassword()
        {
            return View();
        }
        public IActionResult ChangePassword()
        {
            return View();
        }

        public IActionResult ProfileRight()
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
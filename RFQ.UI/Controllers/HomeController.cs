using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Extension;
using RFQ.UI.Models;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IUsersService _usersService;
        private readonly IMenuServices _menuServices;
        public HomeController(IMenuServices menuServices, GlobalClass globalClass, IUsersService usersService)
        {
            _globalClass = globalClass;
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
        public IActionResult UserSave([FromBody] UserRequestDto userRequestDto)
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
            // string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
            string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

            if (userRequestDto != null)
            {
                // userRequestDto.CompanyId = Convert.ToInt32(companyid);
                userRequestDto.CreatedBy = Convert.ToInt32(profileid);
                userRequestDto.UpdatedBy = Convert.ToInt32(profileid);
                userRequestDto.ProfileId = Convert.ToInt32(profileid);


                var result = _usersService.AddUsers(userRequestDto);
                return Json(new { result = "success" });
            }
            else
            {
                return Json(new { result = "fail" });
            }
        }
        [HttpGet]
        public async Task<IActionResult> ViewUserList()
        {
            try
            {
                var userlist = await _usersService.GetAllUser();

                if (Request.IsAjaxRequest())
                {
                    return Json(userlist);
                }
                else
                {
                    return Json(userlist);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpPut]
        public async Task<IActionResult> EditUserList([FromBody] UserRequestDto userRequestDto)
        {
            try
            {
                int userId = userRequestDto.UserId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                //string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                //var user = new UserViewModelDto()
                //{
                //UserId = userViewModelDto.UserId,
                //PersonName = userViewModelDto.PersonName,
                //MobileNo = userViewModelDto.MobileNo,
                //EmailId = userViewModelDto.EmailId,
                //LocationId = userViewModelDto.LocationId,
                //LoginId = userViewModelDto.LoginId,
                //Password = userViewModelDto.Password,
                userRequestDto.CreatedBy = Convert.ToInt32(profileid);
                //userRequestDto.CompanyId = Convert.ToInt32(companyid);
                userRequestDto.UpdatedBy = Convert.ToInt32(profileid);
                userRequestDto.ProfileId = Convert.ToInt32(profileid);
                // };
                var result = await _usersService.EditUsers(userId, userRequestDto);
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
        [HttpGet]
        public async Task<IActionResult> GetAllCompanyAndFranchise()
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var alllist = await _usersService.GetAllCompanyAndFranchise();
                if (alllist != null && alllist.Count() > 0)
                {
                    return Json(alllist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(alllist);
                }
                else
                {
                    return View(alllist);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllLocation()
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                int profileID = Convert.ToInt32(profileid);
                var alllist = await _usersService.GetAllLocation();
                if (alllist != null && alllist.Count() > 0)
                {
                    return Json(alllist);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(alllist);
                }
                else
                {
                    return View(alllist);
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
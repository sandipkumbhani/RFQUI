using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using RFQ.UI.Models;
using System.Diagnostics;

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

        [HttpPost]
        public async Task<IActionResult> UserSave([FromBody] UserRequestDto userRequestDto)
        {
            try
            {
                if (userRequestDto != null)
                {
                    userRequestDto.CreatedBy = _globalClass.UserId;
                    userRequestDto.UpdatedBy = _globalClass.UserId;
                    userRequestDto.ProfileId = Convert.ToInt32(userRequestDto.ProfileId);
                    userRequestDto.StatusId = (int)EStatus.IsActive;

                    var result = await _usersService.AddUsers(userRequestDto);
                    var response = JsonConvert.DeserializeObject<NewCommonResponseDto>(result);
                    if (response != null && response.StatusCode == 200)
                        return Json(new { result = "success", data = "User Saved SucsessFully" });
                    else
                        return Json(new { result = "fail", message = response.ErrorMessage });
                }
                return Json(new { result = "fail", message = "Invalid user data provided" });
            }
            catch (Exception ex)
            {
                // Log the exception here if you have logging set up
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ViewUserList([FromBody] PagingParam pagingParam)
        {
            try
            {
                var UserViewModel = new UserResponseDto();
                pagingParam.UserId = _globalClass.UserId;
                var result = await _usersService.GetAllUser(pagingParam);

                if (Request.IsAjaxRequest())
                {
                    return Json(new
                    {
                        draw = result.PageNumber,
                        recordsTotal = result.TotalRecordCount,
                        recordsFiltered = result.TotalRecordCount,
                        data = result.Result,
                        displayColumn = result.DisplayColumns,
                        UserId = result.Equals(_globalClass.UserId)
                    });
                }
                else
                {
                    return View(result);
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
                userRequestDto.CreatedBy = _globalClass.UserId;
                userRequestDto.UpdatedBy = _globalClass.UserId;

                var result = await _usersService.EditUsers(userId, userRequestDto);
                if (result != null)
                    return Json(new { result = "success" });
                else
                    return Json(new { result = "failure" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        [HttpDelete("Home/DeleteUserList/{userId}")]
        public async Task<IActionResult> DeleteUserList(int userId)
        {
            try
            {
                var result = await _usersService.DeleteUsers(userId);
                if (result != null)
                    return Json(new { result = "success" });
                else
                    return Json(new { result = "failure" });
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
                var alllist = await _usersService.GetAllCompanyAndFranchise();
                if (alllist != null && alllist.Count() > 0)
                    return Json(alllist);

                if (Request.IsAjaxRequest())
                    return Json(alllist);
                else
                    return View(alllist);
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
                var alllist = await _usersService.GetAllLocation();
                if (alllist != null && alllist.Count() > 0)
                    return Json(alllist);
                if (Request.IsAjaxRequest())
                    return Json(alllist);
                else
                    return View(alllist);
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
        public async Task<IActionResult> GetMenu(MenulistModel menuViewModel)
        {
            try
            {
                var menulist = await _menuServices.GetMenu(_globalClass.ProfileId);
                if (menulist != null && menulist.Count() > 0)
                {
                    ViewBag.menulist = menulist;
                    return Json(menulist);
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
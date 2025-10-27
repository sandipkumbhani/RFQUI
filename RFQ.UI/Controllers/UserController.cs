using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class UserController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IUsersService _usersService;

        public UserController(IMenuServices menuServices, GlobalClass globalClass, IUsersService usersService) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _usersService = usersService;
        }
        public async Task<IActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateUserPassword([FromBody] UserRequestDto userRequestDto)
        {
            try
            {
                var result = await _usersService.UpdateUserPassword(userRequestDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }

        public async Task<IActionResult> GetUserById(int UserId)
        {
            try
            {
                var result = await _usersService.GetUserById(UserId);
                if (Request.IsAjaxRequest())
                    return Json(result);
                else
                    return View(result);
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
    }
}

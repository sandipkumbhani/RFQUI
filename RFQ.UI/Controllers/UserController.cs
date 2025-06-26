using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class UserController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IUsersService _usersService;
        private readonly IMenuServices _menuServices;

        public UserController(IMenuServices menuServices, GlobalClass globalClass, IUsersService usersService)
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
        public async Task<IActionResult> UpdateUserPassword([FromBody] UserRequestDto userRequestDto)
        {
            try
            {
                int userId = userRequestDto.UserId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                userRequestDto.CreatedBy = Convert.ToInt32(profileid);
                userRequestDto.UpdatedBy = Convert.ToInt32(profileid);
                userRequestDto.ProfileId = Convert.ToInt32(profileid);

                var result = await _usersService.UpdateUserPassword(userRequestDto);
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
    }
}

using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    
    public class BaseController : Controller
    {
        private readonly IMenuServices _menuServices;
        private readonly GlobalClass _globalClass;
        public BaseController(IMenuServices menuServices, GlobalClass globalClass)
        {
            _menuServices = menuServices;
            _globalClass = globalClass;
        }
        public async Task SetMenuAsync()
        {
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
            string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
            int profileID = Convert.ToInt32(profileid);
            var menuList = await _menuServices.GetMenu(profileID);
            ViewData["menulist"] = menuList.ToList();
        }
    }
}

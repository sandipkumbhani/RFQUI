using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;

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
    }
}

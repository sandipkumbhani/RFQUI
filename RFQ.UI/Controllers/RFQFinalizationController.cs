using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    public class RFQFinalizationController : Controller
    {
        private readonly IMenuServices _menuServices;
        private readonly GlobalClass _globalClass;
        private readonly IUsersService _usersService;

        public RFQFinalizationController(IMenuServices menuServices, GlobalClass globalClass, IUsersService usersService)
        {
            _menuServices = menuServices;
            _globalClass = globalClass;
            _usersService = usersService;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult RFQFinalization()
        {
            return View("Views/RFQ/RFQFinalization.cshtml");
        }
    }
}

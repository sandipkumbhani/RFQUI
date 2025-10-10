using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    public class EWayBillController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IMenuServices _menuServices;

        public EWayBillController(IMenuServices menuServices, GlobalClass globalClass) : base(menuServices, globalClass)
        {
            _menuServices = menuServices;
            _globalClass = globalClass;
        }
        public async Task<IActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }
    }
}

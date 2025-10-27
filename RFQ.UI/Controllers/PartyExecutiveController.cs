using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    public class PartyExecutiveController : BaseController
    {
        private readonly GlobalClass _globalClass;
        public PartyExecutiveController(GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
        }
        public async Task<IActionResult> PartyExecutive()
        {
            await SetMenuAsync();
            return View();
        }
    }
}

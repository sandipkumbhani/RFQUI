using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using System.IO;

namespace RFQ.UI.Controllers
{
    public class TrackingProviderController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IMenuServices _menuServices;
        public TrackingProviderController(GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _menuServices = menuServices;
        }
       
        public async Task<IActionResult> TrackingProvider()
        {
            await SetMenuAsync();
            return View();
        }
    }
}
	
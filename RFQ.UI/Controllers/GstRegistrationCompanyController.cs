using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    public class GstRegistrationCompanyController : BaseController
    {
        private readonly GlobalClass _globalClass;
        public GstRegistrationCompanyController(GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
        }
        public async Task<IActionResult> GstRegistrationCompany()
        {
            await SetMenuAsync();
            return View();
        }
    }
}
	
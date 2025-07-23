using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class CompanyStateController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly ICompanyStateService _companyStateService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CompanyStateController(ICompanyStateService companyStateService, GlobalClass globalClass, IWebHostEnvironment webHostEnvironment)
        {
            _companyStateService = companyStateService;
            _globalClass = globalClass;
            _webHostEnvironment = webHostEnvironment;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStateList()
        {
            try
            {
                var statelist = await _companyStateService.GetAllStateList();

                if (Request.IsAjaxRequest())
                {
                    return Json(statelist);
                }
                else
                {
                    return Json(statelist);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}

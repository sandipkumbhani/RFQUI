using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Extension;

namespace RFQ.UI.Controllers
{
    public class BranchController : Controller
    {
        private readonly IBranchService _branchService;
        private readonly GlobalClass _globalClass;
        public BranchController(IBranchService branchService, GlobalClass globalClass)
        {
            _branchService = branchService;
            _globalClass = globalClass;
        }
        public ActionResult BranchRequest()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVendorList()
        {
            try
            {
                var getAllVendorList = await _branchService.GetAllVendorList();
                if (getAllVendorList != null && getAllVendorList.Count() > 0)
                {
                    return Json(getAllVendorList);
                }
                if (Request.IsAjaxRequest())
                {
                    return Json(getAllVendorList);
                }
                else
                {
                    return View(getAllVendorList);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
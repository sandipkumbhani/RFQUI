using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    public class RequestForQuoteController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IRequestForQuoteService _requestForQuoteService;
        private readonly ILogger<RequestForQuoteController> _logger;
        public RequestForQuoteController(IRequestForQuoteService requestForQuoteService, GlobalClass globalClass, ILogger<RequestForQuoteController> logger)
        {
            _globalClass = globalClass;
            _requestForQuoteService = requestForQuoteService;
            _logger = logger;
        }
        public ActionResult VendorRequest()
        {
            return View();
        }
        public ActionResult Details(int id)
        {
            return View();
        }
        public ActionResult RFQDetails()
        {
            return View();
        }


        [HttpGet]
        public async Task<IActionResult> GetAllVehicleIndentList()
        {
            try
            {
                var result = await _requestForQuoteService.GetAllVehicleIndentList();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}

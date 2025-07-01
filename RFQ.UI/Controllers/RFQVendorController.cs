using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Controllers
{
    public class RFQVendorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public ActionResult InsertRfqVendor([FromBody] RfqVendorRequestDto model)
        {
            if (model == null || model.Rfq == null)
            {
                return BadRequest(new { result = "error", message = "Invalid RFQ data." });
            }

            int newRfqId = new Random().Next(1000, 9999); // Replace with DB-generated ID

            // TODO: Save model.Rfq and model.RfqDetails to your database

            return Json(new { result = "success", rfqId = newRfqId });
        }
    }
}

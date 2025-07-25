using Microsoft.AspNetCore.Mvc;

namespace RFQ.UI.Controllers
{
    public class MapController : Controller
    {
        public IActionResult MapPartial()
        {
            return PartialView("_MapPartial"); // Ensure _MapPartial.cshtml is correct
        }
    }
}

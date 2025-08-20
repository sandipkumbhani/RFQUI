using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace RFQ.UI.Controllers
{
    public class TrackingProviderController : Controller
    {
        public IActionResult TrackingProvider()
        {
            return View();
        }
    }
}
	
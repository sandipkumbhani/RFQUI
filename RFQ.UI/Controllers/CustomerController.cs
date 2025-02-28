using Microsoft.AspNetCore.Mvc;

namespace RFQ.UI.Controllers
{
    public class CustomerController : Controller
    {
        public IActionResult Customer()
        {
            return View();
        }

    }
}

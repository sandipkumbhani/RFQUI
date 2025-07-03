using Microsoft.AspNetCore.Mvc;

namespace RFQ.UI.Controllers
{
    public class QuoteRateBranchController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public ActionResult QuoteRateBranch()
        {
            return View();
        }
    }
}

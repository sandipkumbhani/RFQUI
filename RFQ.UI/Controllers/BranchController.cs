using Microsoft.AspNetCore.Mvc;

namespace RFQ.UI.Controllers
{
    public class BranchController : Controller
    {
        public ActionResult BranchRequest()
        {
            return View();
        }

        public ActionResult QuoteRate()
        {
            return View();
        }
    }
}

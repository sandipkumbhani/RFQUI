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

      
    }
}
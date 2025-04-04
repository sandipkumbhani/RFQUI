using Microsoft.AspNetCore.Mvc;

namespace RFQ.UI.Controllers
{
    public class CompanyConfigrationController : Controller
    {
        // GET: CompanyConfigrationController1
        public ActionResult Index()
        {
            return View();
        }

        // GET: CompanyConfigrationController1/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: CompanyConfigrationController1/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: CompanyConfigrationController1/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: CompanyConfigrationController1/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: CompanyConfigrationController1/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: CompanyConfigrationController1/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: CompanyConfigrationController1/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace RFQ.UI.Controllers
{
    public class VehicleIndentController : Controller
    {
        // GET: VehicleIndentController
        public ActionResult Index()
        {
            return View();
        }

        // GET: VehicleIndentController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: VehicleIndentController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: VehicleIndentController/Create
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

        // GET: VehicleIndentController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: VehicleIndentController/Edit/5
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

        // GET: VehicleIndentController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: VehicleIndentController/Delete/5
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

using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    public class DeliveryOrCloseTripController : BaseController
    {
        private readonly GlobalClass _globalClass;

        public DeliveryOrCloseTripController(GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
        }
      
        public async Task<IActionResult> DeliveryOrCloseTrip()
        {
            await SetMenuAsync();
            return View();
        }
    }
}

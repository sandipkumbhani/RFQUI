using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Controllers
{
    public class BookingOrTripController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IMenuServices _menuServices;
        public BookingOrTripController(GlobalClass globalClass, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _menuServices = menuServices;
        }
        public async Task<IActionResult> BookingOrTrip()
        {
            await SetMenuAsync();
            return View();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Controllers
{
    public class EWayBillController : BaseController
    {
        private readonly GlobalClass _globalClass;
        private readonly IEWayBillService _eWayBillService;

        public EWayBillController(IMenuServices menuServices, GlobalClass globalClass, IEWayBillService eWayBillService) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _eWayBillService = eWayBillService;
        }
        public async Task<IActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        public async Task<IActionResult> GetTripDetailsByBillExpiryDate([FromBody] TripDetailsRequestDto tripDetailsRequestDto)
        {
            try
            {
                var result = await _eWayBillService.GetTripDetailsByBillExpiryDate(tripDetailsRequestDto);
                return Json(new NewCommonResponseDto { Data = result, Message = "TripDetails SucssesFully Fetched", StatusCode = 200 });
            }
            catch (Exception ex)
            {
                return Json(new NewCommonResponseDto { Data = null, Message = ex.Message.ToString(), StatusCode = 500 });
            }
        }
    }
}

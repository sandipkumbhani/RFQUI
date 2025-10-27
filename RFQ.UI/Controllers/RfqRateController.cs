using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Controllers
{
    public class RfqRateController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IRfqRateServices _rfqRateServices;
        public RfqRateController(IRfqRateServices rfqRateServices, GlobalClass globalClass)
        {
            _rfqRateServices = rfqRateServices;
            _globalClass = globalClass;
        }

        [HttpPost]
        public async Task<IActionResult> AddRfqRate([FromBody] RfqRateRequestDto rfqRateRequestDto)
        {
            try
            {
                if (rfqRateRequestDto != null)
                {
                    var result = await _rfqRateServices.AddRfqRate(rfqRateRequestDto);
                    return Json(result);
                }
                else
                {
                    return Json(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}

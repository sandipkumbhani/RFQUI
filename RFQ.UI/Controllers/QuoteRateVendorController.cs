using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Controllers
{
    public class QuoteRateVendorController : Controller
    {

        private readonly GlobalClass _globalClass;
        private readonly IQuoteRateVendorService _rfqRateService;
        public QuoteRateVendorController(GlobalClass globalClass, IQuoteRateVendorService rfqRateService)
        {
            _globalClass = globalClass;
            _rfqRateService = rfqRateService;
        }
        public IActionResult Index()
        {
            return View();
        }
        public ActionResult QuoteRateVendor()
        {
            return View();
        }
        public ActionResult QuoteRateBranch()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> SaveQuoteRateVendor([FromBody] QuoteRateVendorRequestDto rfqRateRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                if (rfqRateRequestDto != null)
                {
                    rfqRateRequestDto.UpdatedOn = DateTime.Now;

                    var result = _rfqRateService.AddQuoteRateVendor(rfqRateRequestDto);
                    return Json(new { result });
                }
                else
                {
                    return Json(new { result = "fail" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
    }
}

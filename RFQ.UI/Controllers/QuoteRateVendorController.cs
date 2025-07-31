using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.Numerics;
using RFQ.UI.Domain.ResponseDto;
using System.Threading.Tasks;

namespace RFQ.UI.Controllers
{
    public class QuoteRateVendorController : Controller
    {

        private readonly GlobalClass _globalClass;
        private readonly IQuoteRateVendorService _rfqRateService;
        private readonly IRequestForQuoteService _requestForQuoteService;
        public QuoteRateVendorController(GlobalClass globalClass, IQuoteRateVendorService rfqRateService, IRequestForQuoteService requestForQuoteService)
        {
            _globalClass = globalClass;
            _rfqRateService = rfqRateService;
            _requestForQuoteService = requestForQuoteService;
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
        public async Task<IActionResult> SaveQuoteRateVendor([FromBody] QuoteRateVendorRequestDto rfqRateRequestDto)
        {
            try
            {
                //var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                //string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;

                if (rfqRateRequestDto != null)
                {
                    rfqRateRequestDto.UpdatedOn = DateTime.Now;
                    var result = _rfqRateService.AddQuoteRateVendor(rfqRateRequestDto);
                    return Json(new { result });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
    }
}

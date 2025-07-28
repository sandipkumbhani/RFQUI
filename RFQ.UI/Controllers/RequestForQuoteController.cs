using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using System.ComponentModel.Design;
using System.IdentityModel.Tokens.Jwt;

namespace RFQ.UI.Controllers
{
    public class RequestForQuoteController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IRequestForQuoteService _requestForQuoteService;
        private readonly ILogger<RequestForQuoteController> _logger;
        public RequestForQuoteController(IRequestForQuoteService requestForQuoteService, GlobalClass globalClass, ILogger<RequestForQuoteController> logger)
        {
            _globalClass = globalClass;
            _requestForQuoteService = requestForQuoteService;
            _logger = logger;
        }
        public ActionResult VendorRequest()
        {
            return View();
        }
        public ActionResult Details(int id)
        {
            return View();
        }
        public ActionResult RFQDetails()
        {
            return View();
        }


        [HttpGet]
        public async Task<IActionResult> GetAllVehicleIndentList()
        {
            try
            {
                var result = await _requestForQuoteService.GetAllVehicleIndentList();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetRfqNo()
        {
            try
            {
                var result = await _requestForQuoteService.GetRfqNo();
                return Json(new { result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddRfq([FromBody] RfqRequestDto RfqRequestDto)
        {
            try
            {
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                if (RfqRequestDto != null)
                {
                    RfqRequestDto.CreatedBy = Convert.ToInt32(userid);
                    RfqRequestDto.UpdatedBy = Convert.ToInt32(userid);

                    var result = await _requestForQuoteService.AddRfq(RfqRequestDto);
                    return Json(result);
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

        [HttpGet("RequestForQuote/GetRfqByRfqNo/{rfqNo}")]
        public async Task<IActionResult> GetRfqByRfqNo(string rfqNo)
        {
            try
            {
                var result = await _requestForQuoteService.GetRfqByRfqNo(rfqNo);
                if (result != null)
                {
                    return Json(result);
                }
                else
                {
                    return Json(null);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetAllVendorListForRfq([FromBody] RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            try
            {
                _logger.LogInformation("Requesting GetAllVendorListForRfq Details...");
                var result = await _requestForQuoteService.GetAllVendorListForRfq(rfqVendorDetailsParam);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                return Ok(ex);
            }
        }
    }
}

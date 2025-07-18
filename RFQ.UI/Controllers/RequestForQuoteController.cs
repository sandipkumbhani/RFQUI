using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
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
                
                if (RfqRequestDto != null)
                {
                    RfqRequestDto.CreatedBy = Convert.ToInt32(profileid);
                    RfqRequestDto.UpdatedBy = Convert.ToInt32(profileid);

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
    }
}

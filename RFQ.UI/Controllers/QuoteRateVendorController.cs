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
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace RFQ.UI.Controllers
{
    public class QuoteRateVendorController : BaseController
    {

        private readonly GlobalClass _globalClass;
        private readonly IQuoteRateVendorService _rfqRateService;
        private readonly IRequestForQuoteService _requestForQuoteService;

        public QuoteRateVendorController(GlobalClass globalClass, IQuoteRateVendorService rfqRateService, IRequestForQuoteService requestForQuoteService, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _rfqRateService = rfqRateService;
            _requestForQuoteService = requestForQuoteService;
        }
        public async Task<IActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }
        public async Task<ActionResult> QuoteRateVendor()
        {
            await SetMenuAsync();
            return View();
        }
        public async Task<ActionResult> QuoteRateBranch()
        {
            await SetMenuAsync();
            return View();
        }
        public async Task<IActionResult> SaveQuoteRateVendor([FromBody] QuoteRateVendorRequestDto rfqRateRequestDto)
        {
            try
            {
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
        public async Task<IActionResult> GetRfqQuoteRateVendorDetailsqById([FromBody] QuoteRateVendorRequestDto rfqRateRequestDto)
        {
            try
            {
                if (rfqRateRequestDto != null)
                {
                    rfqRateRequestDto.UpdatedOn = DateTime.Now;
                    var result = await _requestForQuoteService.GetRfqQuoteRateVendorDetailsqById((int)rfqRateRequestDto.RfqId);

                    if (result == null)
                    {
                        return Json(new NewCommonResponseDto
                        {
                            Data = null,
                            StatusCode = 404,
                            Message = "No data found."
                        });
                    }

                    return Json(new NewCommonResponseDto
                    {
                        Data = result,
                        StatusCode = 200,
                        Message = "Success"
                    });
                    
                }
                return null;
            }
            catch (Exception ex)
            {
                return Json(new NewCommonResponseDto
                {
                    Data = null,
                    StatusCode = 500,
                    Message = $"Error: {ex.Message}"
                });
            }
        }
    }
}

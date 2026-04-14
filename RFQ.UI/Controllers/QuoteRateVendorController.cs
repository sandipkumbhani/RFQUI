using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Controllers
{
    public class QuoteRateVendorController : BaseController
    {

        private readonly GlobalClass _globalClass;
        private readonly IQuoteRateVendorService _rfqRateService;
        private readonly IRequestForQuoteService _requestForQuoteService;
        private readonly ICryptographyService _cryptographyService;

        public QuoteRateVendorController(GlobalClass globalClass, IQuoteRateVendorService rfqRateService, IRequestForQuoteService requestForQuoteService, IMenuServices menuServices, ICryptographyService cryptographyService) : base(menuServices, globalClass)
        {
            _globalClass = globalClass;
            _rfqRateService = rfqRateService;
            _requestForQuoteService = requestForQuoteService;
            _cryptographyService = cryptographyService;
        }
        public async Task<IActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }
        public async Task<ActionResult> QuoteRateVendor()
        {
            string encVendorId = !string.IsNullOrEmpty(Request.Query["VendorId"]) ? Request.Query["VendorId"].ToString() : "";
            string encRfqId = !string.IsNullOrEmpty(Request.Query["RfqId"]) ? Request.Query["RfqId"].ToString() : "";
            int vendorId = Convert.ToInt32(_cryptographyService.Decrypt(Uri.UnescapeDataString(encVendorId)));
            int rfqId = Convert.ToInt32(_cryptographyService.Decrypt(Uri.UnescapeDataString(encRfqId)));

            if (rfqId > 0)
            {
                int isRFQFinalized = await _rfqRateService.CheckFinalizationStatusOfRFQ(rfqId);
                if (isRFQFinalized == 1)
                    return View("~/Views/QuoteRateVendor/RFQFinalizeError.cshtml");
            }
            ViewBag.rfqId = rfqId;
            ViewBag.vendorId = vendorId;
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
                    var result = await _requestForQuoteService.GetRfqQuoteRateVendorDetailsById((int)rfqRateRequestDto.RfqId);

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

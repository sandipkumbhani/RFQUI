using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Controllers
{
    public class ReceivedVendorCostingController : BaseController
    {

        private readonly IReceivedVendorCostingService _receivedVendorCostingService;
        private readonly IEmailService _emailService;
        private readonly GlobalClass _globalClass;

        public ReceivedVendorCostingController(GlobalClass globalClass, IReceivedVendorCostingService receivedVendorCostingService, IEmailService emailService, IMenuServices menuServices) : base(menuServices, globalClass)
        {
            _receivedVendorCostingService = receivedVendorCostingService;
            _emailService = emailService;
            _globalClass = globalClass;
        }
        public async Task<IActionResult> Index()
        {
            await SetMenuAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetAllReceivedVendorCosting()
        {
            try
            {
                ReceivedVendorCosting request = new();
                request.CompanyId = _globalClass.CompanyId;

                var result = await _receivedVendorCostingService.GetAllReceivedVendorCosting(request);
                if (result == null || !result.Any())
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

        [HttpPost]
        public async Task<bool> SendEmail([FromBody] VendorCostingListResponseDto vendor)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(vendor.Email) || string.IsNullOrEmpty(vendor.Email)) return false;
                RfqQuoteRateVendorDetails newData = new();
                newData.PartyName = vendor.PackingName;
                newData.RfqNo = vendor.RFQNumber;
                newData.RfqDate = vendor.RFQDate ?? DateTime.Now;
                newData.ExpiryDate = vendor.RFQExpiredOn ?? DateTime.Now;
                newData.VehicleReqOn = vendor.VehicleRequiredOn ?? DateTime.Now;
                newData.FromLocation = vendor.Origin;
                newData.ToLocation = vendor.Destination;
                newData.VehicleTypeName = vendor.VehicleType;
                newData.VehicleCount = vendor.AvailableVehicle;
                newData.SpecialInstruction = vendor.SpecialInstruction.ToString();
                newData.ItemName = vendor.ItemName;
                newData.PANNo = vendor.PANNo;
                newData.PackingTypeName = vendor.PackingName;
                newData.RfqId = vendor.RfqId;
                newData.VendorId = vendor.PartyId;

                string baseUrl = $"{Request.Scheme}://{Request.Host}/QuoteRateVendor/QuoteRateVendor";
                string longUrl = $"{baseUrl}?RfqId={vendor.RfqId}&VendorId={vendor.PartyId}";
                string body = "";

                body += "Dear Vendor,\n\n";
                body += "You are requested to provide your quote for the requested services/products. Please use the link below to submit your quotation:\n\n";
                body += longUrl + "\n\n";  // use short link here
                body += "Kindly ensure that you submit your response before the specified deadline.\n\n";
                body += "If you have any questions, feel free to contact us.\n\n";
                body += "Thank you,\n";
                body += "FleetLynk Team";

                var emailRequest = new EmailRequest
                {
                    ToEmail = vendor.Email,
                    Subject = "Quote Request - FleetLynk",
                    Body = body
                };
                return await _emailService.SendEmailAsync(emailRequest);
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}

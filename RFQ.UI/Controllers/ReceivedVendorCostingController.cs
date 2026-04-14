using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RFQ.UI.Application.Interface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Controllers
{
    public class ReceivedVendorCostingController : BaseController
    {

        private readonly IReceivedVendorCostingService _receivedVendorCostingService;
        private readonly IEmailService _emailService;
        private readonly GlobalClass _globalClass;
        private readonly IWhatsAppService _whatsAppService;
        private readonly IRequestForQuoteService _requestForQuoteService;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        private readonly ICryptographyService _cryptographyService;

        public ReceivedVendorCostingController(GlobalClass globalClass, IReceivedVendorCostingService receivedVendorCostingService, IEmailService emailService, IMenuServices menuServices, IWhatsAppService whatsAppService, IRequestForQuoteService requestForQuoteService, CommonApiAdaptor commonApiAdaptor, ICryptographyService cryptographyService) : base(menuServices, globalClass)
        {
            _receivedVendorCostingService = receivedVendorCostingService;
            _emailService = emailService;
            _globalClass = globalClass;
            _whatsAppService = whatsAppService;
            _requestForQuoteService = requestForQuoteService;
            _commonApiAdaptor = commonApiAdaptor;
            _cryptographyService = cryptographyService;
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
                vendor.Email = "pratik.dev540@gmail.com";
                if (string.IsNullOrWhiteSpace(vendor.Email) || string.IsNullOrEmpty(vendor.Email)) return false;
                
                string encryptedRfqId = Uri.EscapeDataString(_cryptographyService.Encrypt(vendor.RfqId.ToString()));
                string encryptedVendorId = Uri.EscapeDataString(_cryptographyService.Encrypt(vendor.PartyId.ToString()));

                string baseUrl = $"{Request.Scheme}://{Request.Host}/QuoteRateVendor/QuoteRateVendor";
                string longUrl = $"{baseUrl}?RfqId={encryptedRfqId}&VendorId={encryptedVendorId}";
                string body = "";

                body += "Dear Vendor,<br><br>";
                body += "You are requested to provide your quote for the requested services/products. Please use the link below to submit your quotation:<br><br>";
                body += $"<a href='{longUrl}' target='_blank'>Click here</a><br><br>";
                body += "Kindly ensure that you submit your response before the specified deadline.<br><br>";
                body += "If you have any questions, feel free to contact us.<br><br>";
                body += "Thank you,<br>";
                body += "FleetLynk Team";

                var emailRequest = new EmailRequest
                {
                    ToEmail = vendor.Email,
                    Subject = "Quote Request - FleetLynk",
                    Body = body,
                    IsHtml = true
                };
                return await _emailService.SendEmailAsync(emailRequest);
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost]
        public async Task<bool> SendReBidWhatsApp([FromBody] VendorCostingListResponseDto vendor)
        {
            try
            {
                return true;
                if (string.IsNullOrWhiteSpace(vendor.WhatsAppNo) || string.IsNullOrEmpty(vendor.WhatsAppNo)) return false;
               
                string baseUrl = $"{Request.Scheme}://{Request.Host}/QuoteRateVendor/QuoteRateVendor";
                string formLink = $"{baseUrl}?RfqId={vendor.RfqId}&VendorId={vendor.PartyId}";
                var response = await _commonApiAdaptor.GetShortLink(formLink);
                var shortUrl = JsonConvert.DeserializeObject<ShortLinkResponseDto>(response)?.ShortUrl;

                List<string> dVar = new();
                var Vendor = await _requestForQuoteService.GetMasterPartyById(vendor.PartyId);
                string partyName = string.IsNullOrEmpty(Vendor.PartyName) ? "Vendor" : Vendor.PartyName;
                dVar.Add(partyName);
                dVar.Add(shortUrl);

                var body = new WhatsAppRequestDto
                {
                    MobileNo = vendor.WhatsAppNo,
                    TemplateName = WhatsAppTemplate.rfqevent,
                    DVariables = string.Join(",", dVar),
                };

                await _whatsAppService.SendMessageAsync(body);
                return true;

            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}

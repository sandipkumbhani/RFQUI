using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Extension;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using RFQ.UI.Domain.Helper;
using System.Net.Mail;
using System.Text;

namespace RFQ.UI.Controllers
{
    public class RequestForQuoteController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IRequestForQuoteService _requestForQuoteService;
        private readonly ILogger<RequestForQuoteController> _logger;
        private readonly IRfqLinkService _rfqLinkService;
        private readonly IWhatsAppService _whatsAppService;
        public RequestForQuoteController(IRequestForQuoteService requestForQuoteService, GlobalClass globalClass, ILogger<RequestForQuoteController> logger, IRfqLinkService rfqLinkService, IWhatsAppService whatsAppService)
        {
            _globalClass = globalClass;
            _requestForQuoteService = requestForQuoteService;
            _logger = logger;
            _rfqLinkService = rfqLinkService;
            _whatsAppService = whatsAppService;
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
        public async Task<IActionResult> GetAllVehicleIndentList([FromQuery] int companyId)
        {
            try
            {
                var result = await _requestForQuoteService.GetAllVehicleIndentList(companyId);
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
        public async Task<IActionResult> AddRfq([FromBody] RequestForQuoteRequestDto requestForQouteRequestDto)
        {
            try
            {
                List<RfqRecipientResponseDto> RfqRecipientsList = new();
                List<RfqLinkRequestDto> RfqSendlinkList = new();
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string profileid = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                string companyid = jwt.Claims.First(c => c.Type == "companyid").Value;
                if (requestForQouteRequestDto != null)
                {
                    requestForQouteRequestDto.RfqRequestDto.CompanyId = Convert.ToInt32(companyid);
                    requestForQouteRequestDto.RfqRequestDto.CreatedBy = Convert.ToInt32(userid);
                    requestForQouteRequestDto.RfqRequestDto.UpdatedBy = Convert.ToInt32(userid);

                    var result = await _requestForQuoteService.AddRfq(requestForQouteRequestDto);
                    if (result != null && result.RfqRecipients.Count > 0)
                    {

                        RfqRecipientsList = result.RfqRecipients;
                        foreach (var vendor in RfqRecipientsList)
                        {
                            RfqQuoteRateVendorDetails data = await _requestForQuoteService.GetRfqQuoteRateVendorDetailsqById(vendor.RfqId);
                            if (data != null)
                            {
                                data.VendorId = vendor.VendorId;
                                string? formLink = Url.Action("QuoteRateVendor", "QuoteRateVendor", data, Request.Scheme) ?? string.Empty;
                                //string? link = await GetShortUrl(formLink);
                                bool check = await _whatsAppService.SendWhatsAppMessageAsync(data.WhatsAppNo, formLink);
                                //bool check = SendEmail(vendor, formLink);
                                if (check)
                                {
                                    RfqSendlinkList.Add(new RfqLinkRequestDto
                                    {
                                        RfqId = vendor.RfqId,
                                        VendorId = vendor.VendorId,
                                        CreatedBy = Convert.ToInt32(userid),
                                        SharedLink = formLink,
                                        CreatedOn = DateTime.UtcNow
                                    });
                                    bool addlinkCheck = await _rfqLinkService.AddRfqLinkData(RfqSendlinkList);
                                }
                            }
                        }
                    }
                    return Json(result);
                }
                else
                    return Json(new { result = "failure" });
            }
            catch (Exception ex)
            {
                return Json(new { result = "error", message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetAllRfq([FromBody] PagingParam pagingParam)
        {
            try
            {
                var result = await _requestForQuoteService.GetAllRfq(pagingParam);
                if (Request.IsAjaxRequest())
                {
                    return Json(new
                    {
                        draw = result.PageNumber,
                        recordsTotal = result.TotalRecordCount,
                        recordsFiltered = result.TotalRecordCount,
                        data = result.Result
                    });
                }
                else
                {
                    return View(result);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRfq([FromBody] RequestForQuoteRequestDto requestForQuoteRequestDto)
        {
            try
            {
                if (requestForQuoteRequestDto.RfqRequestDto.RfqId <= 0)
                {
                    return Json(new { result = "error", message = "Invalid RfqId." });
                }
                int rfqId = requestForQuoteRequestDto.RfqRequestDto.RfqId;
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);
                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;
                requestForQuoteRequestDto.RfqRequestDto.CompanyId = Convert.ToInt32(companyId);
                requestForQuoteRequestDto.RfqRequestDto.CreatedBy = Convert.ToInt32(userid);
                requestForQuoteRequestDto.RfqRequestDto.UpdatedBy = Convert.ToInt32(userid);
                var result = await _requestForQuoteService.UpdateRfq(rfqId, requestForQuoteRequestDto);
                if (result != null)
                {
                    return Json(new { result = "success" });
                }
                else
                {
                    return Json(new { result = "failure" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = "Error", message = ex.Message });
            }
        }

        [HttpDelete("RequestForQuote/DeleteRfq/{rfqId}")]
        public async Task<IActionResult> DeleteRfq(int rfqId)
        {
            try
            {
                var result = await _requestForQuoteService.DeleteRfq(rfqId);
                if (result)
                {
                    return Json(new { result = "success" });
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

        public async Task<IActionResult> GetPreviousQuotesList([FromBody] RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            try
            {
                _logger.LogInformation("Requesting GetPreviousQuotesList Details...");
                var result = await _requestForQuoteService.GetPreviousQuotesList(rfqVendorDetailsParam);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                return Ok(ex);
            }
        }

        private bool SendEmail(RfqRecipientResponseDto vendor, string formLink)
        {

            if (string.IsNullOrEmpty(vendor.EmailId)) return false;

            var subject = "Quote Request - FleetLynk";
            string body = "";

            body += "Dear Vendor,\n\n";
            body += "You are requested to provide your quote for the requested services/products. Please use the link below to submit your quotation:\n\n";
            body += formLink + "\n\n";
            body += "Kindly ensure that you submit your response before the specified deadline.\n\n";
            body += "If you have any questions, feel free to contact us.\n\n";
            body += "Thank you,\n";
            body += "FleetLynk Team";


            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("amit.dev1018@gmail.com", "fqrf srsh rllg cpwl"), // <-- App password here
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("amit.dev1018@gmail.com", "FleetLynk"),  // your Gmail address
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(vendor.EmailId);

                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static async Task<string> GetShortUrl(string longUrl)
        {
            using (HttpClient client = new HttpClient())
            {
                string requestUrl = $"https://tinyurl.com/api-create.php?url={Uri.EscapeDataString(longUrl)}";
                string response = await client.GetStringAsync(requestUrl);
                return response;
            }

        }
    }
}

using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;

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
        public async Task<IActionResult> AddRfq([FromBody] RequestForQuoteRequestDto requestForQouteRequestDto)
        {
            try
            {
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
                        var sentLinks = new List<object>();
                        List<RfqRecipientResponseDto> RfqRecipientsList = result.RfqRecipients;
                        foreach (var vendor in RfqRecipientsList)
                        {
                            RfqQuoteRateVendorDetails data = await _requestForQuoteService.GetRfqQuoteRateVendorDetailsqById(vendor.RfqId);
                            if (data != null)
                            {
                                string? formLink = Url.Action("QuoteRateVendor", "QuoteRateVendor", data, Request.Scheme) ?? string.Empty;
                                SendEmail(vendor, formLink);
                                sentLinks.Add(formLink);
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
    }
}

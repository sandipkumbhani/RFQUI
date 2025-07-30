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

        public async Task<IActionResult> SendQuoteLinks([FromBody] List<RfqRecipientRequestDto> vendorList)
        {
            var sentLinks = new List<object>();
            foreach (var vendor in vendorList)
            {
                RfqResponseDto data = await _requestForQuoteService.GetRfqById(vendor.RfqId ?? 0);
                if (data != null)
                {
                    string? formLink = string.Empty;
                    //string? formLink = Url.Action("QuoteRateVendor", "QuoteRateVendor",
                    //            new
                    //            {
                    //                RfqId = data.RfqId,
                    //                RfqNo = data.RfqNo,
                    //                CompanyId = data.CompanyId,
                    //                LocationId = data.LocationId,
                    //                RfqDate = data.RfqDate,
                    //                ExpiryDate = data.ExpiryDate,
                    //                PartyId = data.PartyId,
                    //                VehicleReqOn = data.VehicleReqOn,
                    //                FromLocation = data.FromLocation,
                    //                ToLocation = data.ToLocation,
                    //                VehicleTypeId = data.VehicleTypeId,
                    //                VehicleCount = data.VehicleCount,
                    //                RfqPriorityId = data.RfqPriorityId,
                    //                ItemId = data.ItemId,
                    //                PackingTypeId = data.PackingTypeId,
                    //                SpecialInstruction = data.SpecialInstruction,
                    //                VendorId = vendor.VendorId,
                    //                PanNo = vendor.PanNo,
                    //            }, Request.Scheme) ?? string.Empty;
                    SendEmail(vendor, formLink);
                    sentLinks.Add(formLink);
                }
            }
            return Json(new { links = sentLinks });
        }

        private bool SendEmail(RfqRecipientRequestDto vendor, string formLink)
        {
            // Validate email exists (dummy check)
            if (string.IsNullOrEmpty(vendor.EmailId)) return false;

            // Prepare email
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

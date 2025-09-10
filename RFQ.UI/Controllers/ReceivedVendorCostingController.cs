using Microsoft.AspNetCore.Mvc;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace RFQ.UI.Controllers
{
    public class ReceivedVendorCostingController : Controller
    {
        private readonly GlobalClass _globalClass;
        private readonly IReceivedVendorCostingService _receivedVendorCostingService;
        public ReceivedVendorCostingController(GlobalClass globalClass, IReceivedVendorCostingService receivedVendorCostingService)
        {
            _globalClass = globalClass;
            _receivedVendorCostingService = receivedVendorCostingService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetAllReceivedVendorCosting()
        {
            try
            {
                ReceivedVendorCosting request = new();
                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(_globalClass.Token);

                

                string companyId = jwt.Claims.First(c => c.Type == "companyid").Value;
                string profileId = jwt.Claims.First(c => c.Type == "profileid").Value;
                string userid = jwt.Claims.First(c => c.Type == "userid").Value;

                //string rfqId = jwt.Claims.First(c => c.Type == "rfqid").Value;
                //string partyId = jwt.Claims.First(c => c.Type == "partyid").Value;
                request.CompanyId = Convert.ToInt32(companyId);
                var result = await _receivedVendorCostingService.GetAllReceivedVendorCosting(request);
                if (result == null || !result.Any())
                    return Json(new { success = false, message = "No data found." });
                else
                    return Json(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public bool SendEmail([FromBody] VendorCostingListResponseDto vendor)
        {
            if (vendor == null || string.IsNullOrEmpty(vendor.Email)) return false;
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


            var subject = "Quote Request - FleetLynk";
            string baseUrl = $"{Request.Scheme}://{Request.Host}/QuoteRateVendor/QuoteRateVendor";
            string longUrl = $"{baseUrl}?RfqId={vendor.RfqId}&VendorId={vendor.PartyId}";
            string shortUrl = ShortenUrl(longUrl);


            string body = "";

            body += "Dear Vendor,\n\n";
            body += "You are requested to provide your quote for the requested services/products. Please use the link below to submit your quotation:\n\n";
            body += shortUrl + "\n\n";  // use short link here
            body += "Kindly ensure that you submit your response before the specified deadline.\n\n";
            body += "If you have any questions, feel free to contact us.\n\n";
            body += "Thank you,\n";
            body += "FleetLynk Team";


            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("amit.dev1018@gmail.com", "fqrf srsh rllg cpwl"),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("amit.dev1018@gmail.com", "FleetLynk"),
                    Subject = subject,  
                    Body = body,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(vendor.Email);

                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private string ShortenUrl(string longUrl)
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "YOUR_BITLY_ACCESS_TOKEN");

            var payload = new
            {
                long_url = longUrl
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("https://api-ssl.bitly.com/v4/shorten", content).Result;

            if (response.IsSuccessStatusCode)
            {
                var responseContent = response.Content.ReadAsStringAsync().Result;
                dynamic json = JsonConvert.DeserializeObject(responseContent);
                return json.link;
            }

            return longUrl; // fallback
        }


    }
}

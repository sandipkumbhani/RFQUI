using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Application.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly IConfiguration _config;
        public WhatsAppService(IConfiguration configuration)
        {
            _config = configuration;
        }
        public async Task<bool> SendWhatsAppMessageAsync(string toNumber, string messageText)
        {
            // Read values
            string accessToken = _config["WhatsAppService:AccessToken"];
            string vendorUid = _config["WhatsAppService:VendorUid"];       // comes from rlogic9
            string WhatsAppApiUrl = _config["WhatsAppService:WhatsAppApiUrl"];

            var url = $"{WhatsAppApiUrl}/{vendorUid}/contact/send-message";
            try
            {
                using (var client = new HttpClient())
                {
                    var request = new HttpRequestMessage(HttpMethod.Post, url);
                    var payload = new
                    {
                        from_phone_number_id = string.Empty,   // optional
                        phone_number = toNumber,                    // Example: "919876543210"
                        message_body = messageText,                 // Your message text

                        // optional contact details
                        contact = new
                        {
                            first_name = "Johan",
                            last_name = "Doe",
                            email = "johndoe@domain.com",
                            country = "india",
                            language_code = "en",
                            groups = "examplegroup1,examplegroup2",
                            custom_fields = new
                            {
                                BDay = "2025-09-04"
                            }
                        }
                    };
                    var jsonPayload = JsonConvert.SerializeObject(payload);
                    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    request.Content = content;
                    var response = await client.SendAsync(request);
                    response.EnsureSuccessStatusCode();
                    Console.WriteLine(await response.Content.ReadAsStringAsync());
                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}

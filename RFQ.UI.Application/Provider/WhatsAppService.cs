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
        public async Task SendWhatsAppMessageAsync(string toNumber, string messageText)
        {
            // Read values
            string accessToken = _config["WhatsAppService:AccessToken"];
            string phoneNumberId = _config["WhatsAppService:PhoneNumberId"];
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                var url = $"https://graph.facebook.com/v17.0/{phoneNumberId}/messages";

                var payload = new
                {
                    messaging_product = "whatsapp",
                    to = toNumber, // Example: "919876543210"
                    type = "text",
                    text = new { body = messageText }
                };

                var jsonPayload = JsonConvert.SerializeObject(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(url, content);
                var result = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Error sending WhatsApp message: {result}");
                }

                Console.WriteLine($"WhatsApp message sent successfully: {result}");
            }
        }
    }
}

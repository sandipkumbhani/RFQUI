using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly AppSettingsGlobal _appSettings;
        private readonly ILogger<WhatsAppService> _logger;
        public WhatsAppService(IConfiguration configuration, HttpClient httpClient, AppSettingsGlobal appSettings, ILogger<WhatsAppService> logger)
        {
            _config = configuration;
            _httpClient = httpClient;
            _appSettings = appSettings;
            _logger = logger;
        }

        public async Task<string> SendMessageAsync(WhatsAppRequestDto requestDto)
        {
            try
            {
                var url = _appSettings.WhatsAppApiUrl;
                var whatsAppConfig = _config.GetSection("WhatsAppService");

                var body = new
                {
                    MobileNo = requestDto.MobileNo,
                    TemplateName = requestDto.TemplateName,
                    DVariables = requestDto.DVariables,
                    ServiceProvider = whatsAppConfig["ServiceProvider"],
                    ApiKey = whatsAppConfig["ApiKey"],
                    VendorId = Guid.Parse(whatsAppConfig["VendorId"] ?? Guid.Empty.ToString())
                };

                _logger.LogInformation("WhatsApp API URL: {Url}", url);
                _logger.LogInformation("WhatsApp Request content: {RequestBody}", JsonConvert.SerializeObject(body));
                var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(url, content);
                var result = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("WhatsApp Api response: {response}", result);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while sending WhatsApp message to {MobileNo}", requestDto.MobileNo);
                throw;
            }
        }
    }
}

using Microsoft.Extensions.Configuration;
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
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly AppSettingsGlobal _appSettings;
        public WhatsAppService(IConfiguration configuration, HttpClient httpClient, AppSettingsGlobal appSettings)
        {
            _config = configuration;
            _httpClient = httpClient;
            _appSettings = appSettings;
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

                var content = new StringContent(JsonConvert.SerializeObject(body),Encoding.UTF8,"application/json");
                var response = await _httpClient.PostAsync(url, content);
                var result = await response.Content.ReadAsStringAsync();
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Infrastructure.Provider
{
    public class RfqLinkAdaptor : IRfqLinkAdaptor
    {
        private readonly GlobalClass _globalClass; private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly ILogger<RfqLinkAdaptor> _logger;
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public RfqLinkAdaptor(IConfiguration configuration, ILogger<RfqLinkAdaptor> logger, HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
        {
            _config = configuration;
            _logger = logger;
            _globalClass = new GlobalClass();
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<bool> AddRfqLinkData(List<RfqLinkRequestDto> rfqLinkRequestDto)
        {
            try
            {
                string AuthToken = _httpContextAccessor.HttpContext?.Request.Cookies["AuthToken"];
                _globalClass.Token = AuthToken;
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = _fleetLynkApiUrl + _config["RequestForQuote:AddRfqLink"];
                var rfq = JsonConvert.SerializeObject(rfqLinkRequestDto);
                var requestContent = new StringContent(rfq, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200 && responseModel.Data == true.ToString())
                        return true;
                    else
                        return false;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in AddRfq: " + ex.Message);
            }

            return false;
        }
    }
}

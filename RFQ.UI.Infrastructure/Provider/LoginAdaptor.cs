using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class LoginAdaptor : ILoginAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private ILogger<LoginAdaptor> _logger;
        public LoginAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration,ILogger<LoginAdaptor> logger)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _logger = logger;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }
        public async Task<string> PostApiDataAsync(LoginDto loginDto)
        {
            try
            {
                _httpClient = new HttpClient();
                var baseUrl = _fleetLynkApiUrl + _config["Login:Login"];
                _logger.LogInformation("Base URL: " + baseUrl); 
                var company = JsonConvert.SerializeObject(loginDto);
                var requestContent = new StringContent(company, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("responseData  : " + responseData);
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var responseToken = JsonConvert.DeserializeObject<ResponseToken>(responseModel?.Data.ToString()!);
                    return responseToken.Token;

                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("API Error : " + ex.Message);
                _logger.LogInformation("API Error Inner Exception: " + ex.InnerException);
                _logger.LogInformation("========================================================================================================");
                _logger.LogInformation("\n\n");
                throw new Exception(ex.Message);
            }
            return null;
        }

        public class ResponseToken
        {
            public string? Token { get; set; }
        }
    }
}

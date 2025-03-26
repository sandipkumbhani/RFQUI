using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
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
        public LoginAdaptor(HttpClient httpClient,GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<string> PostApiDataAsync(LoginViewModel loginViewModel)
        {
            try
            {
                _httpClient = new HttpClient();
                var baseUrl = $"{_fleetLynkApiUrl}/api/Login/Login";
                var company = JsonConvert.SerializeObject(loginViewModel);
                var requestContent = new StringContent(company, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var responseToken = JsonConvert.DeserializeObject<ResponseToken>(responseModel?.Data.ToString()!);
                    return responseToken.Token;

                }
                return string.Empty;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
            }
            return null;
        }

        public class ResponseToken
        {
            public string? Token { get; set; }
        }
    }
}

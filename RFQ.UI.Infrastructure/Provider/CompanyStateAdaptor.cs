using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using System.Net.Http;

namespace RFQ.UI.Infrastructure.Provider
{
    public class CompanyStateAdaptor : ICompanyStateAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;

        public CompanyStateAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }
        public async Task<List<CompanyStateResponseDto>> GetAllStateList()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseUrl = _fleetLynkApiUrl + _config["CompanyState:GetAllCompanyState"];
                var response = await _httpClient.GetAsync(baseUrl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var stateList = JsonConvert.DeserializeObject<List<CompanyStateResponseDto>>(Convert.ToString(responseModel.Data!));
                    return stateList;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

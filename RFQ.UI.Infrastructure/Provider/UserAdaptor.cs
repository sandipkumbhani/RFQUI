using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;

namespace RFQ.UI.Infrastructure.Provider
{
    public class UserAdaptor : IUserAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public UserAdaptor(GlobalClass globalClass, IConfiguration configuration)
        {
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<IEnumerable<CompanyUserDto>> GetAllUsers()
        {
            var _httpClient = new HttpClient();

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["User:GetUserAll"]);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var dashboardItems = JsonConvert.DeserializeObject<List<CompanyUserDto>>(Convert.ToString(responseModel.Data!));
                return dashboardItems;
            }
            return null;
        }
    }
}

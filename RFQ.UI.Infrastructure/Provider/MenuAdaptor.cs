using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MenuAdaptor : IMenuAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;

        public MenuAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");

        }
        public async Task<IEnumerable<MenulistModel>> GetMenu(int profileId)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Menu:GetMenu"] + profileId);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var menulist = JsonConvert.DeserializeObject<List<MenulistModel>>(Convert.ToString(responseModel.Data!));
                    return menulist;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

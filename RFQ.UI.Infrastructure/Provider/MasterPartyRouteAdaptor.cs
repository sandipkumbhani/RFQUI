using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MasterPartyRouteAdaptor : IMasterPartyRouteAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public MasterPartyRouteAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<IEnumerable<MasterPartyRouteResponseDto>> GetMasterPartyRouteByPartyId(int id)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetMasterPartyRoute + id}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var routeList = JsonConvert.DeserializeObject<IEnumerable<MasterPartyRouteResponseDto>>(Convert.ToString(responseModel.Data!));
                    return routeList;
                }
                return null;

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<string> DeleteMasterPartyRouteById(int id)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = _appSettings.BaseUrl + _config["MasterPartyRoute:DeleteMasterPartyRoute"] + id;
                var response = await _httpClient.DeleteAsync(url);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var message = Convert.ToString(responseModel.Data!);
                    return message;
                }
                return null;

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while Deleting  routes for the party.", ex);
            }
        }
    }

}

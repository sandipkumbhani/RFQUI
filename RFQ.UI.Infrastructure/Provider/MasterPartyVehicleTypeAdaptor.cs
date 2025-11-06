using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MasterPartyVehicleTypeAdaptor : IMasterPartyVehicleTypeAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public MasterPartyVehicleTypeAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<IEnumerable<MasterPartyVehicleTypeResponseDto>?> GetMasterPartyVehicleTypeByPartyId(int id)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetMasterPartyVehicleType + id}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var vehicleTypeList = JsonConvert.DeserializeObject<IEnumerable<MasterPartyVehicleTypeResponseDto>>(Convert.ToString(responseModel.Data!));
                    return vehicleTypeList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string?> DeleteMasterPartyVehicleTypeById(int id)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = _appSettings.BaseUrl + _config["MasterPartyVehicleType:DeleteMasterPartyVehicleType"] + id;
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
            catch (Exception)
            {
                throw;
            }
        }
    }
}

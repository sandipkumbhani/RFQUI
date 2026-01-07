using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class LocationAdaptor : ILocationAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public LocationAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;

        }
        public async Task<bool> AddLocation(LocationRequestDto locationRequestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.AddLocation;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, locationRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return true;
                else
                    return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> DeleteLocation(int LocationId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["Location:DeleteLoction"] + LocationId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "location Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to Delete location";
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<bool> EditLocation(int LocationId, LocationRequestDto locationRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.Updatelocation + LocationId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, locationRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return true;
                else
                    return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<LocationResponseDto>> GetAllLocationList(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl}{_config["Location:GetAllLocationList"]}?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var ProfileList = JsonConvert.DeserializeObject<List<LocationResponseDto>>(Convert.ToString(responseModel.Data!));
                    return ProfileList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<PageList<LocationResponseDto>?> GetAllLocation(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllLocation;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<LocationResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<LocationResponseDto> GetLocationById(int locationId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl +'/'+_appSettings.GetLocationById + locationId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = JsonConvert.DeserializeObject<LocationResponseDto>(Convert.ToString(responseModel.Data!));
                    return result;
                }
                else
                    return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

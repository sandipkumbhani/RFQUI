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
        public LocationAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");

        }
        public async Task<string> AddLocation(LocationRequestDto locationRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["Location:AddLocation"];
                var User = JsonConvert.SerializeObject(locationRequestDto);
                var requestContent = new StringContent(User, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "Location Saved";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return string.Empty;
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
        public async Task<string> EditLocation(int LocationId, LocationRequestDto locationRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Location:Updatelocation"] + LocationId;
                var user = JsonConvert.SerializeObject(locationRequestDto);
                var requestContent = new StringContent(user, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "location Updated...";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to Update location ";
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
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseUrl = $"{_fleetLynkApiUrl}{_config["Location:GetAllLocationList"]}?companyId={companyId}";
                var response = await _httpClient.GetAsync(baseUrl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Location:GetAllLocation"];
                var param = JsonConvert.SerializeObject(pagingParam);
                var requestContent = new StringContent(param, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null && responseModel.Data != null)
                {
                    var json = JsonConvert.SerializeObject(responseModel.Data.result);
                    var typedList = JsonConvert.DeserializeObject<List<LocationResponseDto>>(json);
                    dynamic parsed = JsonConvert.DeserializeObject<dynamic>(responseData);
                    int pageNumber = parsed.data.pageNumber;
                    int pageSize = parsed.data.pageSize;
                    int totalPage = parsed.data.totalPage;
                    int totalRecordCount = parsed.data.totalRecordCount;

                    return new PageList<LocationResponseDto>(typedList, totalRecordCount, pageNumber, pageSize);

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

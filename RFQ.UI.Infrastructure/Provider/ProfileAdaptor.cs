using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class ProfileAdaptor : IProfileAdoptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public ProfileAdaptor(GlobalClass globalClass, IConfiguration configuration)
        {
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }
        public async Task<string> AddProfile(ProfileRequestDto profileRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Profile:AddProfile"];
                var profile = JsonConvert.SerializeObject(profileRequestDto);
                var requestContent = new StringContent(profile, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "Profile Saved";
                    }
                    else
                    {
                        return responseModel.ErrorMessage ?? "An error occurred";
                    }
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<ProfileResponseDto>> GetProfileAll()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Profile:GetProfileAll"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var Profilelist = JsonConvert.DeserializeObject<List<ProfileResponseDto>>(Convert.ToString(responseModel.Data!));
                    return Profilelist;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<InternalMasterResponseDto>> GetAllApplicableList()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Profile:GetAllInternalMaster"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var alllist = JsonConvert.DeserializeObject<List<InternalMasterResponseDto>>(Convert.ToString(responseModel.Data!));
                    return alllist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<IEnumerable<LinkGroupResponseDto>> GetAllMenuGroup()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["ProfileRight:GetAllLinkGroup"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var alllist = JsonConvert.DeserializeObject<List<LinkGroupResponseDto>>(Convert.ToString(responseModel.Data!));
                    return alllist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<IEnumerable<LinkItemResponseDto>> GetLinkItemList()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["ProfileRight:GetLinkItemList"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var alllist = JsonConvert.DeserializeObject<List<LinkItemResponseDto>>(Convert.ToString(responseModel.Data!));
                    return alllist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IEnumerable<ProfileRightsResponseDto>> GetProfileRightsByProfileId(int profileId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["ProfileRight:GetProfileRightsByProfileId"] + profileId);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var profileRightslist = JsonConvert.DeserializeObject<List<ProfileRightsResponseDto>>(Convert.ToString(responseModel.Data!));
                    return profileRightslist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> AddOrUpdateProfileRights(List<ProfileRightsResponseDto> requestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["ProfileRight:AddOrUpdateProfileRights"];
                var listProfile = JsonConvert.SerializeObject(requestDto);
                var requestContent = new StringContent(listProfile, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "Profile Saved";
                    }
                    else
                    {
                        return responseModel.ErrorMessage ?? "An error occurred";
                    }
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

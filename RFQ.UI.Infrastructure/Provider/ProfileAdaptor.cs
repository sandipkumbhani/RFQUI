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
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public ProfileAdaptor(GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<string> AddProfile(ProfileRequestDto profileRequestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.AddProfile;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, profileRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Profile Saved";
                    else
                        return responseModel.ErrorMessage ?? "An error occurred";
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<ProfileResponseDto>?> GetProfileAll()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetProfileAll}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
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
        public async Task<IEnumerable<InternalMasterResponseDto>?> GetAllApplicableList()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllInternalMaster}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
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
        public async Task<IEnumerable<LinkGroupResponseDto>?> GetAllMenuGroup()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllLinkGroup}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
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
        public async Task<IEnumerable<LinkItemResponseDto>?> GetLinkItemList()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetLinkItemList}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                _httpClient = new HttpClient();
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
        public async Task<IEnumerable<ProfileRightsResponseDto>?> GetProfileRightsByProfileId(int profileId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetProfileRightsByProfileId + profileId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
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
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddOrUpdateProfileRights}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, requestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Profile Saved";
                    else
                        return responseModel.ErrorMessage ?? "An error occurred";
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

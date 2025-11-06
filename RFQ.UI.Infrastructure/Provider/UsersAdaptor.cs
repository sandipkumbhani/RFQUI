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
    public class UsersAdaptor : IUsersAdoptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public UsersAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<string> AddUsers(UserRequestDto userRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddUser}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, userRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        responseModel.Message = "User Saved";
                    else
                        responseModel.Message = responseModel.ErrorMessage;

                    string json = JsonConvert.SerializeObject(responseModel);
                    return json;
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> DeleteUsers(int UserId)
        {
            try
            {

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["Users:DeleteUser"] + UserId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "User Deleted";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to Delete User";
            }
            catch (Exception)
            {
                throw;
            }

        }
        public async Task<string> EditUsers(int userId, UserRequestDto userRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateUser + userId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, userRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "User Updated...";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to Update User ";
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<PageList<UserResponseDto>?> GetAllUser(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetUserAll;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<UserResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }

        }
        public async Task<UserResponseDto> GetUserById(int userId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetUserById + userId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.Data != null)
                {
                    var json = JsonConvert.SerializeObject(responseModel.Data);
                    var user = JsonConvert.DeserializeObject<UserResponseDto>(json);
                    var userResponse = new UserResponseDto
                    {
                        UserId = user.UserId,
                        CompanyId = user.CompanyId,
                        LocationId = user.LocationId,
                        ProfileId = user.ProfileId,
                        Company = user.Company,
                        CreatedBy = user.CreatedBy,
                        Location = user.Location,
                        LoginId = user.LoginId,
                        MobileNo = user.MobileNo,
                        UpdatedBy = user.UpdatedBy,
                        PersonName = user.PersonName,
                        EmailId = user.EmailId,
                        StatusId = user.StatusId,
                        Password = user.Password
                    };
                    return userResponse;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Failed to fetch user by ID", ex);
            }
        }
        public async Task<IEnumerable<CompanyAndFranchiseListDto>> GetAllCompanyAndFranchise()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllCompanyAndFranchise}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var alllist = JsonConvert.DeserializeObject<List<CompanyAndFranchiseListDto>>(Convert.ToString(responseModel.Data!));
                    return alllist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<IEnumerable<LocationListDto>> GetAllLocation()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllMasterLocation}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var alllist = JsonConvert.DeserializeObject<List<LocationListDto>>(Convert.ToString(responseModel.Data!));
                    return alllist;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<bool> UpdateUsersPassword(UserRequestDto userRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateUserPassword}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, userRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return true;
                    else
                        return false;
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<UserResponseDto> GetByLoginIdAsync(string LoginId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetByLoginIdAsync + LoginId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                using var httpClient = new HttpClient();

                if (responseModel != null && responseModel.StatusCode == 200 && responseModel.Data != null)
                {
                    var json = JsonConvert.SerializeObject(responseModel.Data);
                    var user = JsonConvert.DeserializeObject<UserResponseDto>(json);
                    var userResponse = new UserResponseDto
                    {
                        UserId = user.UserId,
                        CompanyId = user.CompanyId,
                        LocationId = user.LocationId,
                        ProfileId = user.ProfileId,
                        Company = user.Company,
                        CreatedBy = user.CreatedBy,
                        Location = user.Location,
                        LoginId = user.LoginId,
                        MobileNo = user.MobileNo,
                        UpdatedBy = user.UpdatedBy,
                        PersonName = user.PersonName,
                        EmailId = user.EmailId,
                        StatusId = user.StatusId,
                    };
                    return userResponse;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Failed to fetch user by ID", ex);
            }
        }
    }
}
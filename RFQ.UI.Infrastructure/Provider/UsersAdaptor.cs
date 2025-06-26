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
        public UsersAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");

        }
        public async Task<string> AddUsers(UserRequestDto userRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);


                var baseurl = _fleetLynkApiUrl + _config["Users:AddUser"];
                var User = JsonConvert.SerializeObject(userRequestDto);
                var requestContent = new StringContent(User, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                if (!response.IsSuccessStatusCode)
                {
                    string errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Error: {response.StatusCode}, Details: {errorContent}");

                    var errorResponse = new NewCommonResponseDto
                    {
                        StatusCode = (int)response.StatusCode,
                        Data = null,
                        Message = errorContent.ToString(),
                        ErrorMessage = errorContent
                    };
                    string json = JsonConvert.SerializeObject(errorResponse);
                    return json;
                }
                else
                {
                    var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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
        public async Task<string> EditUsers(int UserId, UserRequestDto userRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["Users:UpdateUser"] + UserId;
                var user = JsonConvert.SerializeObject(userRequestDto);
                var requestContent = new StringContent(user, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "User Updated...";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
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
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Users:GetUserAll"];
                var param = JsonConvert.SerializeObject(pagingParam);
                var requestContent = new StringContent(param, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null && responseModel.Data != null)
                {
                    var json = JsonConvert.SerializeObject(responseModel.Data.result);
                    var typedList = JsonConvert.DeserializeObject<List<UserResponseDto>>(json);
                    dynamic parsed = JsonConvert.DeserializeObject<dynamic>(responseData);
                    int pageNumber = parsed.data.pageNumber;
                    int pageSize = parsed.data.pageSize;
                    int totalPage = parsed.data.totalPage;
                    int totalRecordCount = parsed.data.totalRecordCount;

                    return new PageList<UserResponseDto>(typedList, totalRecordCount, pageNumber, pageSize);
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public Task<string> GetUsers(int userId)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<CompanyAndFranchiseListDto>> GetAllCompanyAndFranchise()
        {
            try
            {
                var _httpclient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Users:GetAllCompanyAndFranchise"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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
                var _httpclient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Users:GetAllMasterLocation"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var alllist = JsonConvert.DeserializeObject<List<LocationListDto>>(Convert.ToString(responseModel.Data!));
                    return alllist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<bool> UpdateUsersPassword(UserRequestDto userRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["Users:UpdateUserPassword"];
                var user = JsonConvert.SerializeObject(userRequestDto);
                var requestContent = new StringContent(user, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200 && responseModel.Data == true.ToString())
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

    }
}
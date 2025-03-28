using System.Text;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;

namespace RFQ.UI.Infrastructure.Provider
{
    public class UsersAdaptor : IUsersAdoptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;

        public UsersAdaptor(HttpClient httpClient, GlobalClass globalClass)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
        }
        public async Task<string> AddUsers(UserRequestDto userRequestDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = "https://localhost:7272/api/CompanyUser/AddUser";

            var User = JsonConvert.SerializeObject(userRequestDto);
            var requestContent = new StringContent(User, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "Users Saved";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return string.Empty;
                }
        public async Task<string> DeleteUsers(int UserId)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"https://localhost:7272/api/CompanyUser/DeleteUser/{UserId}";
            var response = await _httpClient.DeleteAsync(baseurl);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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
        public async Task<string> EditUsers(int UserId, UserRequestDto userRequestDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"https://localhost:7272/api/CompanyUser/UpdateUser/{UserId}";
            var user = JsonConvert.SerializeObject(userRequestDto);
            var requestContent = new StringContent(user, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if(responseModel != null)
            {
                var result = responseModel.StatusCode;
                if(result == 200)
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
        public async Task<IEnumerable<UserResponseDto>> GetAllUser()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync("https://localhost:7272/api/CompanyUser/GetUserAll");

            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if(responseModel != null)
            {
                var ProfileList = JsonConvert.DeserializeObject<List<UserResponseDto>>(Convert.ToString(responseModel.Data!));
                return ProfileList;
            }
            return null;
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
                var response = await _httpClient.GetAsync("https://localhost:7272/api/Company/GetAllCompany");
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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
        //public async Task<IEnumerable<LocationListDto>> GetAllLocation()
        //{
        //    try
        //    {
        //        var _httpclient = new HttpClient();
        //        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
        //        var response = await _httpClient.GetAsync("https://localhost:7272/api/MasterLocation/GetAllMasterLocation");
        //        var responseData = await response.Content.ReadAsStringAsync();
        //        var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
        //        if (responseModel != null)
        //        {
        //            var alllist = JsonConvert.DeserializeObject<List<LocationListDto>>(Convert.ToString(responseModel.Data!));
        //            return alllist;
        //        }
        //        return null;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}
    }
}
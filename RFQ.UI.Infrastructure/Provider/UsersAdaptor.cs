using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;
using static RFQ.UI.Domain.Model.UserViewModel;

namespace RFQ.UI.Infrastructure.Provider
{
    public class UsersAdaptor : IUsersAdoptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;

        public UsersAdaptor(HttpClient httpClient, GlobalClass globalClass,IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        
        }
        public async Task<string> AddUsers(UserViewModelDto userViewModelDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/CompanyUser/AddUser";

            var User = JsonConvert.SerializeObject(userViewModelDto);
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

            var baseurl = $"{_fleetLynkApiUrl}/CompanyUser/DeleteUser/{UserId}";
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
        public async Task<string> EditUsers(int UserId, UserViewModelDto userViewModelDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/CompanyUser/UpdateUser/{UserId}";
            var user = JsonConvert.SerializeObject(userViewModelDto);
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
        public async Task<IEnumerable<UserViewModelDto>> GetAllUser()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync($"{_fleetLynkApiUrl}/CompanyUser/GetUserAll");

            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if(responseModel != null)
            {
                var ProfileList = JsonConvert.DeserializeObject<List<UserViewModelDto>>(Convert.ToString(responseModel.Data!));
                return ProfileList;
            }
            return null;
        }
        public Task<string> GetUsers(int userId)
        {
            throw new NotImplementedException();
        }
    }
}
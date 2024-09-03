using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class ProfileAdaptor : IProfileAdoptor
    {
        private HttpClient _httpClient;



        public ProfileAdaptor()
        {
        }

        public async Task<string> AddProfile(ProfileViewModelDto profileViewModelDto)
        {
            _httpClient = new HttpClient();
           // _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var baseurl = "https://localhost:7272/api/CompanyProfile/AddProfile";

            var profile = JsonConvert.SerializeObject(profileViewModelDto);
            var requestContent = new StringContent(profile, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {

                    return "Profile Saved";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return string.Empty;
        }

        public async Task<IEnumerable<ProfileViewModelDto>> GetProfileAll()
        {
            _httpClient = new HttpClient();
         //   _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync("https://localhost:7272/api/CompanyProfile/GetProfileAll");

            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var Profilelist = JsonConvert.DeserializeObject<List<ProfileViewModelDto>>(Convert.ToString(responseModel.Data!));
                return Profilelist;
            }
            return null;
        }
    }
}

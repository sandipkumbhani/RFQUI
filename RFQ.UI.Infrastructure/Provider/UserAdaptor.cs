using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;

namespace RFQ.UI.Infrastructure.Provider
{
    public class UserAdaptor : IUserAdaptor
    {
        private readonly GlobalClass _globalClass;
        public UserAdaptor(GlobalClass globalClass)
        {
            _globalClass = globalClass;
        }

        public async Task<IEnumerable<CompanyUserDto>> GetAllUsers()
        {
            var _httpClient = new HttpClient();

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync("https://localhost:7272/api/CompanyUser/GetUserAll");

            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var dashboardItems = JsonConvert.DeserializeObject<List<CompanyUserDto>>(Convert.ToString(responseModel.Data!));
                return dashboardItems;
            }
            return null;
        }
    }
}

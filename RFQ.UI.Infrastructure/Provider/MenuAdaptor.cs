using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MenuAdaptor : IMenuAdaptor
    {
        private readonly GlobalClass _globalClass;

        public MenuAdaptor(HttpClient httpClient, GlobalClass globalClass)
        {
            _globalClass = globalClass;
        }
        public async Task<IEnumerable<MenulistDto>> GetMenu(int profileId)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"https://localhost:7272/api/MenuList/GetMenu/{profileId}");
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var menulist = JsonConvert.DeserializeObject<List<MenulistDto>>(Convert.ToString(responseModel.Data!));
                    return menulist;
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

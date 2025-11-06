using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MenuAdaptor : IMenuAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public MenuAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<IEnumerable<MenulistModel>> GetMenu(int profileId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl+ _appSettings.GetMenu + profileId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var menulist = JsonConvert.DeserializeObject<List<MenulistModel>>(Convert.ToString(responseModel.Data!));
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

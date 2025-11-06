using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Infrastructure.Provider
{
    public class UserAdaptor : IUserAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public UserAdaptor(GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;

        }
        public async Task<IEnumerable<UserResponseDto>> GetAllUsers()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetUserAll}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var userList = JsonConvert.DeserializeObject<List<UserResponseDto>>(Convert.ToString(responseModel.Data!));
                    return userList;
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

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Infrastructure.Provider
{
    public class DashboardAdaptor : IDashboardAdaptor
    {
        private readonly CommonApiAdaptor _commonApiAdaptor;
        private readonly AppSettingsGlobal _appSettingsGlobal;
        private readonly ILogger<DashboardAdaptor> _logger;     
        public DashboardAdaptor(CommonApiAdaptor commonApiAdaptor, AppSettingsGlobal appSettingsGlobal, ILogger<DashboardAdaptor> logger)
        {
            _commonApiAdaptor = commonApiAdaptor;
            _appSettingsGlobal = appSettingsGlobal;
            _logger = logger;
        }

        public async Task<IList<DashboardCardResponseDto>?> GetDashboardCards()
        {
            var Url = $"{_appSettingsGlobal.BaseUrl + _appSettingsGlobal.GetCards}";
            _logger.LogInformation("Request URL: {Url}", Url);  
            var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(Url);
            if (responseModel != null)
            {
                var result = JsonConvert.DeserializeObject<List<DashboardCardResponseDto>>(Convert.ToString(responseModel.Data!));
                return result;
            }
            return new List<DashboardCardResponseDto>();
        }

        public async Task<DashboardCardDetailsResponseDto> GetDashboardCardDetails(string cardId)
        {
            var Url = _appSettingsGlobal.BaseUrl + _appSettingsGlobal.GetCardDetails + "?cardId=" + cardId;
            var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(Url);
            if (responseModel != null)
            {
                var result = JsonConvert.DeserializeObject<DashboardCardDetailsResponseDto>(Convert.ToString(responseModel.Data!));
                return result;
            }
            return new DashboardCardDetailsResponseDto();
        }
    }
}

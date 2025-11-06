using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Net.Http;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class EWayBillAdaptor : IEWayBillAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly ILogger<EWayBillAdaptor> _logger;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public EWayBillAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, ILogger<EWayBillAdaptor> logger, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _logger = logger;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;

        }
        public async Task<IEnumerable<TripDetailsResponse>> GetTripDetailsByBillExpiryDate(TripDetailsRequestDto tripDetailsRequestDto)
        {
            try
            {

                var baseUrl = _appSettings.BaseUrl + _appSettings.GetTripDetailsByBillExpiryDate;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, tripDetailsRequestDto, _globalClass.Token);
                if (responseModel?.StatusCode == 200 && responseModel.Data != null)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<TripDetailsResponse>>(responseModel.Data.ToString());
                }
                return Enumerable.Empty<TripDetailsResponse>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Trip Details by Bill Expiry Date");
                throw;
            }
        }
    }
}

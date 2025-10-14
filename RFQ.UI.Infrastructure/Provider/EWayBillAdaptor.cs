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
        public EWayBillAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, ILogger<EWayBillAdaptor> logger)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _logger = logger;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
        }
        public async Task<IEnumerable<TripDetailsResponse>> GetTripDetailsByBillExpiryDate(TripDetailsRequestDto tripDetailsRequestDto)
        {
            try
            {

                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = _fleetLynkApiUrl + _config["EWayBill:GetTripDetailsByBillExpiryDate"];
                var requestJson = JsonConvert.SerializeObject(tripDetailsRequestDto);
                var requestContent = new StringContent(requestJson, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);

                if (responseModel?.StatusCode == 200 && responseModel.Data != null)
                {
                    return JsonConvert.DeserializeObject<IEnumerable<TripDetailsResponse>>(responseModel.Data.ToString());
                }
                return Enumerable.Empty<TripDetailsResponse>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Trip Details by Bill Expiry Date");
                return Enumerable.Empty<TripDetailsResponse>();
            }
        }
    }
}

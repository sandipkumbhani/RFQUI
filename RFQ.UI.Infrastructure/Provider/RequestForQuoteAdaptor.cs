using AutoMapper.Configuration;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using System.Net.Http;

namespace RFQ.UI.Infrastructure.Provider
{
    public class RequestForQuoteAdaptor : IRequestForQuoteAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public RequestForQuoteAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }
        public async Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = _fleetLynkApiUrl + _config["RequestForQuote:GetAllVehicleIndentList"];
                var response = await _httpClient.GetAsync(baseUrl);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return Enumerable.Empty<VehicleIndent>();
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                    return Enumerable.Empty<VehicleIndent>();

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);

                if (responseModel?.Data != null)
                {
                    var indents = JsonConvert.DeserializeObject<IEnumerable<VehicleIndent>>(responseModel.Data.ToString());
                    return indents ?? Enumerable.Empty<VehicleIndent>();
                }

                return Enumerable.Empty<VehicleIndent>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in GetAllVehicleIndentList: {ex}");
                return Enumerable.Empty<VehicleIndent>();
            }
        }

    }
}

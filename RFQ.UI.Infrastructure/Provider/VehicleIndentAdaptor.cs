using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Net.Http;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class VehicleIndentAdaptor : IVehicleIndentAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public VehicleIndentAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
        }
        public async Task<bool> AddVehicleIndent(VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = _fleetLynkApiUrl + _config["VehicleIndent:AddVehicleIndent"];
                var requestJson = JsonConvert.SerializeObject(vehicleIndentRequestDto);
                var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(baseUrl, content);
                var responseData = await response.Content.ReadAsStringAsync();

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddVehicleIndent: {ex.Message}");
            }

            return false;
        }
    }
}

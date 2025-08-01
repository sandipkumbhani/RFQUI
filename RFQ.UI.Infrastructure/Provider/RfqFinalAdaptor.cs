using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class RfqFinalAdaptor : IRfqFinalAdaptor
    {
        private readonly IConfiguration _config;
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly string _fleetLynkApiUrl;
        public RfqFinalAdaptor(HttpClient httpClient,GlobalClass globalClass, IConfiguration configuration)
        {
            _globalClass = globalClass;
            _httpClient = httpClient;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<bool> AddRfqFinal(RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto)
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = _fleetLynkApiUrl + _config["RfqFinal:AddRfqFinal"];
                var rfqFinal = JsonConvert.SerializeObject(rfqFinalizationSaveRequestDto);
                var requestContent = new StringContent(rfqFinal, Encoding.UTF8, "application/json");
                var response = await httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var result = (bool)responseModel.Data;
                    return result;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in AddRfqFinal: " + ex.Message);
            }

            return false;
        }

        public async Task<IEnumerable<VendorFinalizationResposeDto>> AwardedVendor(int id)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = _fleetLynkApiUrl + _config["RfqFinal:AwardedVendor"] + id;
                var response = await _httpClient.GetAsync(url);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var routeList = JsonConvert.DeserializeObject<IEnumerable<VendorFinalizationResposeDto>>(Convert.ToString(responseModel.Data!));
                    return routeList;
                }
                return null;

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching  routes for the party.", ex);
            }
        }
    }
}

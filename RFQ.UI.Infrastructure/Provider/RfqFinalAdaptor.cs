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
        private  HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly string _fleetLynkApiUrl;
        public RfqFinalAdaptor(HttpClient httpClient,GlobalClass globalClass, IConfiguration configuration)
        {
            _globalClass = globalClass;
            _httpClient = httpClient;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<RfqFinalRequestDto?> AddRfqFinal(RfqFinalRequestDto rfqFinalRequestDto)
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = _fleetLynkApiUrl + _config["RfqFinal:AddRfqFinal"];
                var rfq = JsonConvert.SerializeObject(rfqFinalRequestDto);
                var requestContent = new StringContent(rfq, Encoding.UTF8, "application/json");
                var response = await httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var rfqData = JsonConvert.DeserializeObject<RfqFinalRequestDto>(responseModel.Data.ToString());
                    return rfqData;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in AddRfqFinal: " + ex.Message);
            }

            return null;
        }
    }
}

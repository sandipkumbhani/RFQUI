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
        public async Task<RfqFinalRequestDto> AddRfqFinal(RfqFinalRequestDto rfqFinalRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Franchise:AddFranchise"];
                var rfqFinal = JsonConvert.SerializeObject(rfqFinalRequestDto);
                var requestContent = new StringContent(rfqFinal, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return JsonConvert.DeserializeObject<RfqFinalRequestDto>(responseModel.Data.ToString());
                    }
                    else
                    {
                        return null;
                    }
                }
                return null;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }
    }
}

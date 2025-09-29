using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MasterUserActivityLogAdaptor : IMasterUserActivityLogAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public MasterUserActivityLogAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }
        public async Task<MasterUserActivityLogRequestDto?> AddMasterUserActivityLog(MasterUserActivityLogRequestDto masterUserActivityLogRequestDto)
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = $"{_fleetLynkApiUrl}/MasterUserActivityLog/AddMasterUserActivityLog";
                var jsonPayload = JsonConvert.SerializeObject(masterUserActivityLogRequestDto);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(baseUrl, content);
                var responseData = await response.Content.ReadAsStringAsync();

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);

                if (responseModel != null && responseModel.StatusCode == 200 && responseModel.Data != null)
                {

                    var dataToken = responseModel.Data as JToken ?? JToken.FromObject(responseModel.Data);
                    var userActivityLog = dataToken.ToObject<MasterUserActivityLogRequestDto>();
                    return userActivityLog;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in AddMasterUserActivityLog: " + ex.Message);
            }

            return null;
        }
    }
}

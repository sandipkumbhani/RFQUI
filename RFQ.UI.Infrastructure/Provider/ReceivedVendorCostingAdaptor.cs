using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Infrastructure.Provider
{
    public class ReceivedVendorCostingAdaptor : IReceivedVendorCostingAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public ReceivedVendorCostingAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _globalClass = globalClass;
            _httpClient = httpClient;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<IEnumerable<VendorCostingList>> GetAllReceivedVendorCosting(ReceivedVendorCosting request)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["ReceivedVendorCosting:GetAllReceivedVendorCosting"];
                var rfqVendorList = JsonConvert.SerializeObject(request);
                var requestContent = new StringContent(rfqVendorList, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var rateList = JsonConvert.DeserializeObject<IEnumerable<VendorCostingList>>(responseModel.Data.ToString());
                    return rateList;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error in GetAllReceivedVendorCosting: " + ex.Message);
            }
            return Enumerable.Empty<VendorCostingList>();
        }
    }
}

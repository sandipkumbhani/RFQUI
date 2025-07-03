using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class RFQVendorAdaptor : IRFQVendorAdaptor
    {
        private readonly HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly string _fleetLynkApiUrl;

        public RFQVendorAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration config)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = config;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
        }


        public async Task<bool> AddRfqVendor(RfqVendorRequestDto requestDto)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["RFQVendor:AddRfqVendor"];
                var rfqVendorDto = JsonConvert.SerializeObject(requestDto);
                var requestContent = new StringContent(rfqVendorDto, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return JsonConvert.DeserializeObject<bool>(responseModel.Data.ToString());
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return false;
        }

        public async Task<string> GetRfqNo()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["RFQVendor:GetRfqNo"];
                var response = await _httpClient.GetAsync(baseurl);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return null;
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                    return null;

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel?.Data != null)
                {
                    var rfqNo = responseModel.Data.ToString();
                    return rfqNo;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }
    }
}

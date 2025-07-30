using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

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

        public async Task<string> GetRfqNo()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["RequestForQuote:GenerateRfqAutoNo"];
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

        public async Task<RequestForQuoteResponseDto> AddRfq(RequestForQuoteRequestDto requestForQouteRequestDto)
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = _fleetLynkApiUrl + _config["RequestForQuote:AddRfq"];
                var rfq = JsonConvert.SerializeObject(requestForQouteRequestDto);
                var requestContent = new StringContent(rfq, Encoding.UTF8, "application/json");
                var response = await httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var rfqData = JsonConvert.DeserializeObject<RequestForQuoteResponseDto>(responseModel.Data.ToString());
                    return rfqData;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in AddRfq: " + ex.Message);
            }

            return null;
        }

        public async Task<RequestForQuoteResponseDto> GetRfqByRfqNo(string rfqNo)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["RequestForQuote:GetRfqByRfqNo"] + rfqNo;
                var response = await _httpClient.GetAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (responseModel.Data != null && result == 200)
                    {
                        return JsonConvert.DeserializeObject<RequestForQuoteResponseDto>(responseModel.Data.ToString());
                    }
                    else
                    {
                        return null;
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }

        public async Task<RequestForQuoteResponseDto> GetRfqById(int rfqId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["RequestForQuote:GetRfqById"] + rfqId;
                var response = await _httpClient.GetAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (responseModel.Data != null && result == 200)
                    {
                        return JsonConvert.DeserializeObject<RequestForQuoteResponseDto>(responseModel.Data.ToString());
                    }
                    else
                    {
                        return null;
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }

        public async Task<IEnumerable<RfqVendorListResponseDto>> GetAllVendorListForRfq(RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["RequestForQuote:GetAllVendorListForRfq"];
                var rfqVendorList = JsonConvert.SerializeObject(rfqVendorDetailsParam);
                var requestContent = new StringContent(rfqVendorList, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var rfqVendorListData = JsonConvert.DeserializeObject<IEnumerable<RfqVendorListResponseDto>>(responseModel.Data.ToString());
                    return rfqVendorListData;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error in GetAllVendorListForRfq: " + ex.Message);
            }
            return Enumerable.Empty<RfqVendorListResponseDto>();
        }
    }
}

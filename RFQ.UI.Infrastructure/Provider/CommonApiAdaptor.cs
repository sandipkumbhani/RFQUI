using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.ResponseDto;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Infrastructure.Provider
{
    public class CommonApiAdaptor
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public CommonApiAdaptor(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<T?> GetAsync<T>(string url, string? token = null)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            if (!string.IsNullOrEmpty(token))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(content);
        }

        public async Task<T?> PostAsync<T>(string url, object data, string? token = null)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json")
            };
            if (!string.IsNullOrEmpty(token))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(content);
        }

        public async Task<T?> PutAsync<T>(string url, object data, string? token = null)
        {
            var request = new HttpRequestMessage(HttpMethod.Put, url)
            {
                Content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json")
            };
            if (!string.IsNullOrEmpty(token))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(content);
        }

        public async Task<T?> PatchAsync<T>(string url, object data, string? token = null)
        {
            var request = new HttpRequestMessage(HttpMethod.Patch, url)
            {
                Content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json")
            };
            if (!string.IsNullOrEmpty(token))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(content);
        }

        public PageList<T> GenerateResponse<T>(CommanResponseDto commanResponse)
        {
            var returnResponse = new PageList<T>(new List<T>(), 0, 0, 0);
            if (commanResponse?.Data?.result != null)
            {
                returnResponse.Result = JsonConvert.DeserializeObject<List<T>>(
                    JsonConvert.SerializeObject(commanResponse.Data.result)
                );

                returnResponse.PageNumber = commanResponse.Data.pageNumber;
                returnResponse.PageSize = commanResponse.Data.pageSize;
                returnResponse.TotalRecordCount = commanResponse.Data.totalRecordCount;
                returnResponse.DisplayColumns = commanResponse.Data.displayColumns;
                return returnResponse;
            }
            return returnResponse;
        }
    }
}

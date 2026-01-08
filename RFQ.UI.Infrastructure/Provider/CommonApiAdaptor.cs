using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
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
        private readonly AppSettingsGlobal _appSettings;
        private readonly GlobalClass _globalClass;

        public CommonApiAdaptor(HttpClient httpClient, IConfiguration config, AppSettingsGlobal appSettings, GlobalClass globalClass)
        {
            _httpClient = httpClient;
            _config = config;
            _appSettings = appSettings;
            _globalClass = globalClass;
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
            try
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
            catch (Exception ex)
            {
                throw;
            }

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

        public async Task<T?> DeleteAsync<T>(string url, string? token = null)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete, url);

            if (!string.IsNullOrEmpty(token))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(content);
        }

        public async Task<string?> GetAutoGenerateCode(AutoGenerateCodeRequestDto requestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAutoGenerateCode;
                var responseModel = await PostAsync<NewCommonResponseDto>(baseUrl, requestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return responseModel.Data.ToString() ?? null;
                else
                    return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

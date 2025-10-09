using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class FranchiseAdaptor : IFranchiseAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public FranchiseAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
        }
        //public async Task<FranchiseRequestDto> AddFranchise(FranchiseRequestDto franchiseRequestDto)
        //{
        //    try
        //    {
        //        _httpClient = new HttpClient();
        //        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
        //        var baseurl = _fleetLynkApiUrl + _config["Franchise:AddFranchise"];
        //        var franchise = JsonConvert.SerializeObject(franchiseRequestDto);
        //        var requestContent = new StringContent(franchise, Encoding.UTF8, "application/json");
        //        var response = await _httpClient.PostAsync(baseurl, requestContent);
        //        var responseData = await response.Content.ReadAsStringAsync();
        //        var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
        //        if (responseModel != null)
        //        {
        //            var result = responseModel.StatusCode;
        //            if (result == 200)
        //            {
        //                return JsonConvert.DeserializeObject<FranchiseRequestDto>(responseModel.Data.ToString());
        //            }
        //            else
        //            {
        //                return null;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //    }
        //    return null;
        //}
        public async Task<FranchiseRequestDto> AddFranchise(FranchiseRequestDto franchiseRequestDto)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                    string url = _fleetLynkApiUrl + _config["Franchise:AddFranchise"];

                    var jsonContent = JsonConvert.SerializeObject(franchiseRequestDto);
                    var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                    var response = await httpClient.PostAsync(url, content);

                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"API call failed with status: {response.StatusCode}");
                        return null;
                    }

                    var responseData = await response.Content.ReadAsStringAsync();

                    var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                    if (responseModel?.StatusCode == 200 && responseModel.Data != null)
                    {
                        return JsonConvert.DeserializeObject<FranchiseRequestDto>(responseModel.Data.ToString());
                    }

                    Console.WriteLine($"Unexpected response: {responseData}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in AddFranchise: {ex.Message}");
            }

            return null;
        }

        public async Task<string> DeleteFranchise(int companyId)
        {
            try
            {

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}{_config["Franchise:DeleteFranchise"]}{companyId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Franchise Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to Delete Franchise";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> EditFranchise(int companyId, FranchiseRequestDto franchiseRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = $"{_fleetLynkApiUrl}{_config["Franchise:UpdateFranchise"]}{companyId}";
                var franchise = JsonConvert.SerializeObject(franchiseRequestDto);
                var requestContent = new StringContent(franchise, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Franchise Updated";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to update Franchise";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PageList<FranchiseResponseDto>> GetAllFranchise(PagingParam pagingParam)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                    var requestDto = JsonConvert.SerializeObject(pagingParam);
                    var requestContent = new StringContent(requestDto, Encoding.UTF8, "application/json");

                    var baseUrl = _fleetLynkApiUrl + _config["Franchise:GetAllFranchise"];
                    var response = await httpClient.PostAsync(baseUrl, requestContent);
                    var responseData = await response.Content.ReadAsStringAsync();

                    var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);

                    if (responseModel?.Data?.result != null)
                    {
                        var franchiseList = JsonConvert.DeserializeObject<List<FranchiseResponseDto>>(
                            JsonConvert.SerializeObject(responseModel.Data.result)
                        );

                        int pageNumber = responseModel.Data.pageNumber;
                        int pageSize = responseModel.Data.pageSize;
                        int totalRecordCount = responseModel.Data.totalRecordCount;

                        return new PageList<FranchiseResponseDto>(franchiseList, totalRecordCount, pageNumber, pageSize);
                    }
                    return null;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

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
    public class VendorAdaptor : IVendorAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public VendorAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
        }

        public async Task<VendorRequestDto> AddVendor(VendorRequestDto vendorRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Vendor:AddMasterParty"];
                var vendor = JsonConvert.SerializeObject(vendorRequestDto);
                var requestContent = new StringContent(vendor, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        var savedVendor = JsonConvert.DeserializeObject<VendorRequestDto>(responseModel.Data.ToString());
                        return savedVendor;
                    }
                    else
                        return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return null;
        }

        public async Task<string> DeleteVendor(int PartyId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Vendor:DeleteMasterParty"] + PartyId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Vendor Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return "Failed to Delete Vendor";
        }

        public async Task<string> EditVendor(int PartyId, VendorRequestDto vendorRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Customer:UpdateMasterParty"] + PartyId;
                var vendor = JsonConvert.SerializeObject(vendorRequestDto);
                var requestContent = new StringContent(vendor, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Vendor Updated";
                    else
                        return responseModel.ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return "Failed to update Vendor";
        }

        public async Task<IEnumerable<InternalMasterResponseDto>> GetAllInternalMaster()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = _fleetLynkApiUrl + _config["Vendor:GetAllInternalMaster"];
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return null;
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                {
                    return null;
                }
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var internalMasterList = JsonConvert.DeserializeObject<List<InternalMasterResponseDto>>(Convert.ToString(responseModel.Data!));
                    return internalMasterList;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<VendorResponseDto>> GetAllVendor(PagingParam pagingParam)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                    var requestDto = JsonConvert.SerializeObject(pagingParam);
                    var requestContent = new StringContent(requestDto, Encoding.UTF8, "application/json");

                    var baseUrl = _fleetLynkApiUrl + _config["Vendor:GetAllVendor"];
                    var response = await httpClient.PostAsync(baseUrl, requestContent);
                    var responseData = await response.Content.ReadAsStringAsync();

                    var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);

                    if (responseModel?.Data?.result != null)
                    {
                        var vendorList = JsonConvert.DeserializeObject<List<VendorResponseDto>>(
                            JsonConvert.SerializeObject(responseModel.Data.result)
                        );

                        int pageNumber = responseModel.Data.pageNumber;
                        int pageSize = responseModel.Data.pageSize;
                        int totalRecordCount = responseModel.Data.totalRecordCount;

                        return new PageList<VendorResponseDto>(vendorList, totalRecordCount, pageNumber, pageSize);
                    }
                    return null;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<VendorListResponseDto>?> GetAllVendorList()
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var url = _fleetLynkApiUrl + _config["Vendor:GetAllVendorList"];
                var response = await httpClient.GetAsync(url);

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
                    var internalMasterList = JsonConvert.DeserializeObject<List<VendorListResponseDto>>(responseModel.Data.ToString());
                    return internalMasterList;
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return null;
            }
        }

    }
}

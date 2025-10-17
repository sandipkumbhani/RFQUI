using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Data;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class VendorAdaptor : IVendorAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public VendorAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<NewCommonResponseDto> AddVendor(VendorRequestDto vendorRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["Vendor:AddMasterParty"];
                var vendor = JsonConvert.SerializeObject(vendorRequestDto);
                var requestContent = new StringContent(vendor, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);

                if (responseModel == null)
                {
                    return new NewCommonResponseDto
                    {
                        StatusCode = (int)response.StatusCode,
                        Message = "No response received from API",
                        Data = null
                    };
                }

                if (responseModel.StatusCode == 200)
                {
                    var vendorData = JsonConvert.DeserializeObject<VendorRequestDto>(responseModel.Data.ToString());
                    return new NewCommonResponseDto
                    {
                        StatusCode = 200,
                        Message = responseModel.Message,
                        Data = vendorData
                    };
                }

                if (responseModel.StatusCode == 409)
                {
                    return new NewCommonResponseDto
                    {
                        StatusCode = 409,
                        Message = "Duplicate record found. Party details already exist.",
                        Data = null
                    };
                }

                return new NewCommonResponseDto
                {
                    StatusCode = (int)response.StatusCode,
                    Message = "Unexpected response from API",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new NewCommonResponseDto
                {
                    StatusCode = 500,
                    Message = $"Error while saving vendor: {ex.Message}",
                    Data = null
                };
            }
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
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllVendor;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);

                return _commonApiAdaptor.GenerateResponse<VendorResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<VendorListResponseDto>?> GetAllVendorList(int companyId)
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var url = $"{_fleetLynkApiUrl}{_config["Vendor:GetAllVendorList"]}?companyId={companyId}";
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
                    var vendorList = JsonConvert.DeserializeObject<List<VendorListResponseDto>>(responseModel.Data.ToString());
                    return vendorList;
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw;
            }
        }

    }
}

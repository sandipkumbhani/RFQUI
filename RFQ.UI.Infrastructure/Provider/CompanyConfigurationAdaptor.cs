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
    public class CompanyConfigurationAdaptor : ICompanyConfigurationAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public CompanyConfigurationAdaptor(GlobalClass globalClass, IConfiguration configuration)
        {
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<PageList<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration(PagingParam pagingParam)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                    var requestDto = JsonConvert.SerializeObject(pagingParam);
                    var requestContent = new StringContent(requestDto, Encoding.UTF8, "application/json");

                    var baseurl = _fleetLynkApiUrl + _config["CompanyConfiguration:GetAllCompanyConfiguration"];

                    if (string.IsNullOrEmpty(baseurl))
                    {
                        throw new Exception("API URL is not configured correctly.");
                    }

                    var response = await httpClient.PostAsync(baseurl, requestContent);

                    // Check API response status
                    if (!response.IsSuccessStatusCode)
                    {
                        var errorMessage = await response.Content.ReadAsStringAsync();
                        throw new Exception($"API call failed: {response.StatusCode} - {errorMessage}");
                    }

                    var responseData = await response.Content.ReadAsStringAsync();
                    var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);

                    if (responseModel?.Data?.result != null)
                    {
                        var cmpConfigList = JsonConvert.DeserializeObject<List<CompanyConfigurationResponseDto>>(
                            JsonConvert.SerializeObject(responseModel.Data.result)
                        );

                        int pageNumber = responseModel.Data.pageNumber;
                        int pageSize = responseModel.Data.pageSize;
                        int totalRecordCount = responseModel.Data.totalRecordCount;

                        return new PageList<CompanyConfigurationResponseDto>(cmpConfigList, totalRecordCount, pageNumber, pageSize);
                    }

                    return new PageList<CompanyConfigurationResponseDto>(new List<CompanyConfigurationResponseDto>(), 0, pagingParam.Start / pagingParam.Length + 1, pagingParam.Length);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching company configuration: {ex.Message}");
                return new PageList<CompanyConfigurationResponseDto>(new List<CompanyConfigurationResponseDto>(), 0, pagingParam.Start / pagingParam.Length + 1, pagingParam.Length);
            }
        }


        public async Task<IEnumerable<FranchiseResponseDto>> GetAllCompany()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Franchise:GetAllCompany"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var companylist = JsonConvert.DeserializeObject<List<FranchiseResponseDto>>(Convert.ToString(responseModel.Data!));
                    return companylist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IEnumerable<ProviderResponseDto>> GetAllProviders()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Vendor:GetAllInternalMaster"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    List<ProviderResponseDto> providersList = new();
                    List<InternalMasterModel> internalMasterList = JsonConvert.DeserializeObject<List<InternalMasterModel>>(Convert.ToString(responseModel.Data!));
                    foreach (var item in internalMasterList)
                    {
                        if (item.InternalMasterTypeId == 9)
                        {
                            var provider = new ProviderResponseDto()
                            {
                                ProviderName = "SMS_PROVIDER",
                                ProviderValue = item.InternalMasterName,
                                ProviderTypeId = item.InternalMasterTypeId
                            };
                            providersList.Add(provider);
                        }
                        else if (item.InternalMasterTypeId == 10)
                        {
                            var provider = new ProviderResponseDto()
                            {
                                ProviderName = "WHATSAPP_PROVIDER",
                                ProviderValue = item.InternalMasterName,
                                ProviderTypeId = item.InternalMasterTypeId
                            };
                            providersList.Add(provider);
                        }
                    }
                    return providersList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["CompanyConfiguration:AddCompanyConfiguration"];
                var User = JsonConvert.SerializeObject(companyConfigrationRequestDto);
                var requestContent = new StringContent(User, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "Company Configuration Saved";
                    }
                    else
                    {
                        return responseModel.ErrorMessage ?? string.Empty;
                    }
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto companyConfigrationRequestDto)
        {
            var _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var baseurl = _fleetLynkApiUrl + _config["CompanyConfiguration:UpdateCompanyConfiguration"] + "/" + companyConfigrationRequestDto.CompanyConfigId;
            var user = JsonConvert.SerializeObject(companyConfigrationRequestDto);
            var requestContent = new StringContent(user, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                    return "CompanyConfiguration Updated...";
                else
                    return responseModel.ErrorMessage ?? string.Empty;
            }
            return "Failed to Update CompanyConfiguration ";
        }

        public async Task<string> DeleteCompanyConfiguration(int companyConfigId)
        {
            try
            {

                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["CompanyConfiguration:DeleteCompanyConfiguration"] + "/" + companyConfigId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Configuration Deleted";
                    else
                        return responseModel.ErrorMessage ?? string.Empty;
                }
                return "Failed to CompanyConfiguration location";

            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

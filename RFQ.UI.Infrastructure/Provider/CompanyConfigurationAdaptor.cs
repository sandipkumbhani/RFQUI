using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Net;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class CompanyConfigurationAdaptor : ICompanyConfigurationAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public CompanyConfigurationAdaptor(GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<PageList<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllCompanyConfiguration;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<CompanyConfigurationResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }


        public async Task<IEnumerable<FranchiseResponseDto>> GetAllCompany()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["CorporateCompany:GetAllCompanyAndFranchise"]);
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
                var baseUrl = _appSettings.BaseUrl + _appSettings.AddCompanyConfiguration;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, companyConfigrationRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Company Configuration Saved";
                    else
                        return responseModel.ErrorMessage ?? string.Empty;
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
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.UpdateCompanyConfiguration + "/" + companyConfigrationRequestDto.CompanyConfigId;
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, companyConfigrationRequestDto, _globalClass.Token);
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
            catch (Exception)
            {
                throw;
            }
            
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

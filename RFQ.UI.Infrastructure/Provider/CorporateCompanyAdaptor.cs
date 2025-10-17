using AutoMapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Enum;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;


namespace RFQ.UI.Infrastructure.Provider
{
    public class CorporateCompanyAdaptor : ICorporateCompanyAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly IMapper _mapper;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public CorporateCompanyAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, IMapper mapper, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _mapper = mapper;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<CorporateCompanyRequestDto?> AddCorporateCompany(CorporateCompanyRequestDto corporateCompanyRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = $"{_fleetLynkApiUrl}/Company/AddCompany";
                var company = JsonConvert.SerializeObject(corporateCompanyRequestDto);
                var requestContent = new StringContent(company, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return JsonConvert.DeserializeObject<CorporateCompanyRequestDto>(responseModel.Data.ToString());
                        // return _mapper.Map<CorporateCompanyRequestDto?>(responseModel.Data);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }

        public async Task<PageList<CorporateCompanyResponseDto>> GetCorporateCompanyAll(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.CompanyGetAllCompany;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);

                return _commonApiAdaptor.GenerateResponse<CorporateCompanyResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }



        public async Task<IEnumerable<FranchiseListDto>> GetAllFranchise()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseUrl = _fleetLynkApiUrl + _config["CorporateCompany:GetAllCompanyAndFranchise"];
                var response = await _httpClient.GetAsync(baseUrl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var franchiselist = JsonConvert.DeserializeObject<List<FranchiseListDto>>(Convert.ToString(responseModel.Data!));
                    franchiselist = franchiselist.Where(x => x.CompanyTypeId == (int)EnumInternalMaster.FRANCHISE).ToList();
                    return franchiselist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public async Task<string> EditCorporateCompany(int companyId, CorporateCompanyRequestDto corporateCompanyRequestDto)
        {
            try
            {

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/Company/UpdateCompany/{companyId}";
                var vehicle = JsonConvert.SerializeObject(corporateCompanyRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "Corporate Company Updated";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to update Corporate Company";
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> DeleteCorporateCompany(int companyId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/Company/DeleteCompany/{companyId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "Corporate Company Deleted";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to Delete Corporate Company";
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

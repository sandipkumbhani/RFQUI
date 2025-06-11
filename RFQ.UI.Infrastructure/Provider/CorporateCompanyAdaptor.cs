using AutoMapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;
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

        public CorporateCompanyAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, IMapper mapper)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _mapper = mapper;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
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

        public async Task<IEnumerable<CorporateCompanyResponseDto>> GetCorporateCompanyAll()
        {
            try
            {

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"{_fleetLynkApiUrl}/Company/GetAllCompany");

                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var Profilelist = JsonConvert.DeserializeObject<List<CorporateCompanyResponseDto>>(Convert.ToString(responseModel.Data!));
                    return Profilelist;
                }
                return null;
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
                var response = await _httpClient.GetAsync($"https://localhost:7272/api/Company/GetAllCompany");
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var franchiselist = JsonConvert.DeserializeObject<List<FranchiseListDto>>(Convert.ToString(responseModel.Data!));
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

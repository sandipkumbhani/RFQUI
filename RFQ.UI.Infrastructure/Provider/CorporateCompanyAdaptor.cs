using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;
using System.Text;
using static RFQ.UI.Domain.Model.CorporateCompanyViewModel;


namespace RFQ.UI.Infrastructure.Provider
{
    public class CorporateCompanyAdaptor : ICorporateCompanyAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;



        public CorporateCompanyAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<string> AddCorporateCompany(CorporateCompanyViewModelDto corporateCompanyViewModelDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = $"{_fleetLynkApiUrl}/Company/AddCompany";
                var company = JsonConvert.SerializeObject(corporateCompanyViewModelDto);
                var requestContent = new StringContent(company, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {

                        return "Corporate Company Saved";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return string.Empty;
        }

        public async Task<IEnumerable<CorporateCompanyViewModelDto>> GetCorporateCompanyAll()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync($"{_fleetLynkApiUrl}/Company/GetAllCompany");

            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var Profilelist = JsonConvert.DeserializeObject<List<CorporateCompanyViewModelDto>>(Convert.ToString(responseModel.Data!));
                return Profilelist;
            }
            return null;
        }

        public async Task<string> EditCorporateCompany(int companyId, CorporateCompanyViewModelDto corporateCompanyViewModelDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/Company/UpdateCompany/{companyId}";
            var vehicle = JsonConvert.SerializeObject(corporateCompanyViewModelDto);
            var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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

        public async Task<string> DeleteCorporateCompany(int companyId)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/Company/DeleteCompany/{companyId}";
            var response = await _httpClient.DeleteAsync(baseurl);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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
    }
}

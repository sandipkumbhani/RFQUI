using System.Text;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;


namespace RFQ.UI.Infrastructure.Provider
{
    public class CorporateCompanyAdaptor : ICorporateCompanyAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;

        public CorporateCompanyAdaptor(HttpClient httpClient, GlobalClass globalClass)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
        }

        public async Task<string> AddCorporateCompany(CorporateCompanyRequestDto corporateCompanyViewModelDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = "https://localhost:7272/api/Company/AddCompany";
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

        public async Task<IEnumerable<CorporateCompanyResponseDto>> GetCorporateCompanyAll()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync("https://localhost:7272/api/Company/GetAllCompany");

            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var Profilelist = JsonConvert.DeserializeObject<List<CorporateCompanyResponseDto>>(Convert.ToString(responseModel.Data!));
                return Profilelist;
            }
            return null;
        }



        public async Task<IEnumerable<FranchiseListDto>> GetAllFranchise()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"https://localhost:7272/api/Company/GetAllCompany");
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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


        public async Task<string> EditCorporateCompany(int companyId, CorporateCompanyRequestDto corporateCompanyViewModelDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"https://localhost:7272/api/Company/UpdateCompany/{companyId}";
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

            var baseurl = $"https://localhost:7272/api/Company/DeleteCompany/{companyId}";
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

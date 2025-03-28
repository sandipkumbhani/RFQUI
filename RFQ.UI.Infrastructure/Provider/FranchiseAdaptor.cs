using System.Text;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;
using static RFQ.UI.Domain.Model.FranchiseViewModel;

namespace RFQ.UI.Infrastructure.Provider
{
    public class FranchiseAdaptor : IFranchiseAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        public FranchiseAdaptor(HttpClient httpClient, GlobalClass globalClass)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
        }
        public async Task<string> AddFranchise(FranchiseViewModelDto franchiseViewModelDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = "https://localhost:7272/api/Company/AddCompany";
                var franchise = JsonConvert.SerializeObject(franchiseViewModelDto);
                var requestContent = new StringContent(franchise, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {

                        return "Franchise Saved";
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

        public async Task<string> DeleteFranchise(int companyId)
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
                    return "Franchise Deleted";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return "Failed to Delete Franchise";
        }

        public async Task<string> EditFranchise(int companyId, FranchiseViewModelDto franchiseViewModelDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"https://localhost:7272/api/Company/UpdateCompany/{companyId}";
            var vehicle = JsonConvert.SerializeObject(franchiseViewModelDto);
            var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "Franchise Updated";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return "Failed to update Franchise";
        }

        public async Task<IEnumerable<FranchiseViewModel.FranchiseViewModelDto>> GetFranchiseAll()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync("https://localhost:7272/api/Company/GetAllCompany");

            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var Profilelist = JsonConvert.DeserializeObject<List<FranchiseViewModelDto>>(Convert.ToString(responseModel.Data!));
                return Profilelist;
            }
            return null;
        }
    }
}

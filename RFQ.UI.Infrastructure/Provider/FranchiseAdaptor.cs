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
        public async Task<FranchiseRequestDto> AddFranchise(FranchiseRequestDto franchiseRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Franchise:AddCompany"];
                var franchise = JsonConvert.SerializeObject(franchiseRequestDto);
                var requestContent = new StringContent(franchise, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return JsonConvert.DeserializeObject<FranchiseRequestDto>(responseModel.Data.ToString());
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

        public async Task<string> DeleteFranchise(int companyId)
        {
            try
            {

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}{_config["Franchise:DeleteCompany"]}{companyId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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
                var baseurl = $"{_fleetLynkApiUrl}{_config["Franchise:UpdateCompany"]}{companyId}";
                var vehicle = JsonConvert.SerializeObject(franchiseRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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

        public async Task<IEnumerable<FranchiseResponseDto>> GetFranchiseAll()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Franchise:GetAllCompany"]);

                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var franchiseList = JsonConvert.DeserializeObject<List<FranchiseResponseDto>>(Convert.ToString(responseModel.Data!));
                    return franchiseList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

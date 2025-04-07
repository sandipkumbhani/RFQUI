using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;
using System.Net.Http;
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

        public async Task<IEnumerable<CompanyConfigurationResponseDto>> GetAllCompanyConfiguration()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["CompanyConfiguration:GetAllCompanyConfiguration"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var cmpConfiglist = JsonConvert.DeserializeObject<List<CompanyConfigurationResponseDto>>(Convert.ToString(responseModel.Data!));
                    return cmpConfiglist;
                }
                return null;
            }
            catch (Exception ex)
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
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Franchise:GetAllCompany"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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

        public async Task<string> AddCompanyConfiguration(CompanyConfigrationRequestDto requestDto)
        {
            var _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = _fleetLynkApiUrl + _config["CompanyConfiguration:AddCompanyConfiguration"];
            var User = JsonConvert.SerializeObject(requestDto);
            var requestContent = new StringContent(User, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "Company Configuration Saved";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return string.Empty;
        }

        public async Task<string> EditCompanyConfiguration(CompanyConfigrationRequestDto requestDto)
        {
            var _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var baseurl = _fleetLynkApiUrl + _config["CompanyConfiguration:UpdateCompanyConfiguration"] + requestDto.CompanyConfigrationId;
            var user = JsonConvert.SerializeObject(requestDto);
            var requestContent = new StringContent(user, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                    return "CompanyConfiguration Updated...";
                else
                    return responseModel.ErrorMessage;
            }
            return "Failed to Update CompanyConfiguration ";
        }
    }
}

using AutoMapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class CompanyMasterPackingTypeAdaptor : ICompanyMasterPackingTypeAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly IMapper _mapper;
        public CompanyMasterPackingTypeAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, IMapper mapper)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _mapper = mapper;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<string> AddMasterPackingType(CompanyMasterPackingTypeRequestDto companyMasterPackingTypeRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = $"{_fleetLynkApiUrl}/CompanyMasterPackingType/AddMasterPackingType";
                var company = JsonConvert.SerializeObject(companyMasterPackingTypeRequestDto);
                var requestContent = new StringContent(company, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return responseModel.Data.ToString();
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

        public async Task<IEnumerable<CompanyMasterPackingTypeResponseDto>> GetAllMasterPackingType()
        {
            try
            {

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"{_fleetLynkApiUrl}/CompanyMasterPackingType/GetMasterPackingType");

                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var Profilelist = JsonConvert.DeserializeObject<List<CompanyMasterPackingTypeResponseDto>>(Convert.ToString(responseModel.Data!));
                    return Profilelist;
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

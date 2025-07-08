using AutoMapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Infrastructure.Provider
{
    public class RfqBranchAdaptor : IRfqBranchAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly IMapper _mapper;

        public RfqBranchAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, IMapper mapper)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _mapper = mapper;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<RfqBranchRequestDto?> AddRfqBranch(RfqBranchRequestDto rfqRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = $"{_fleetLynkApiUrl}/RfqBranch/AddRfqBranch";
                var company = JsonConvert.SerializeObject(rfqRequestDto);
                var requestContent = new StringContent(company, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync  (baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return JsonConvert.DeserializeObject<RfqBranchRequestDto>(responseModel.Data.ToString());
                        // return _mapper.Map<RfqBranchRequestDto?>(responseModel.Data);
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

        public async Task<List<RfqBranchResponceDto>> GetAllRfqBranchList()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var baseurl = $"{_fleetLynkApiUrl}/RfqVendor/GetAllRfqVendorList";
            var response = await _httpClient.GetAsync(baseurl);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
            if (responseModel != null)
            {
                var Profilelist = JsonConvert.DeserializeObject<List<RfqBranchResponceDto>>(Convert.ToString(responseModel.Data!));
                return Profilelist;
            }
            return null;
        }
    }
}

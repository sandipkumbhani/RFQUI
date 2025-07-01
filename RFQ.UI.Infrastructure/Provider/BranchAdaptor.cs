using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Infrastructure.Provider
{
    public class BranchAdaptor : IBranchAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public BranchAdaptor(GlobalClass globalClass,IConfiguration configuration)
        {
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }
        public async Task<List<VendorListResponseDto>> GetAllVendorList()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Branch:GetAllVendorList"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var getAllVendorList = JsonConvert.DeserializeObject<List<VendorListResponseDto>>(Convert.ToString(responseModel.Data!));
                    return getAllVendorList;
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

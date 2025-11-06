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

    public class RfqRateAdaptor : IRfqRateAdaptor
    {
        private readonly IConfiguration _config;
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public RfqRateAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _globalClass = globalClass;
            _httpClient = httpClient;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<RfqRateRequestDto> AddRfqRate(RfqRateRequestDto rfqRateRequestDto)
        {
            try
            {

                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddRfqRate}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, rfqRateRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var rfqRate = JsonConvert.DeserializeObject<RfqRateRequestDto>(responseModel.Data.ToString());
                    return rfqRate;
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

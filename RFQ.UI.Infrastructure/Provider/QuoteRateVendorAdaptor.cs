using Microsoft.Extensions.Configuration;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Infrastructure.Provider
{
    public class QuoteRateVendorAdaptor : IQuoteRateVendorAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public QuoteRateVendorAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<string> AddQuoteRateVendor(QuoteRateVendorRequestDto rfqRateRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddRfqRate}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, rfqRateRequestDto);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "QuoteRateVendor Saved";
                    else
                        return responseModel.ErrorMessage;
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<int> CheckFinalizationStatusOfRFQ(int rfqId)
        {
            int isFinalized = 0;
            var url = $"{_appSettings.BaseUrl + _appSettings.CheckFinalizationStatusOfRFQ}";
            var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(url + $"/{rfqId}", "");

            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                    isFinalized = Convert.ToInt32(responseModel.Data);
            }

            return isFinalized;
        }
    }
}

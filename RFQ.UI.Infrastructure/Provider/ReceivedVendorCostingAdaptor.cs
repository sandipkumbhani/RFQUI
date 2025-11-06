using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class ReceivedVendorCostingAdaptor : IReceivedVendorCostingAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public ReceivedVendorCostingAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _globalClass = globalClass;
            _httpClient = httpClient;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<IEnumerable<VendorCostingList>> GetAllReceivedVendorCosting(ReceivedVendorCosting requestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllReceivedVendorCosting;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, requestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var rateList = JsonConvert.DeserializeObject<IEnumerable<VendorCostingList>>(responseModel.Data.ToString());
                    return rateList;
                }
                return Enumerable.Empty<VendorCostingList>();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

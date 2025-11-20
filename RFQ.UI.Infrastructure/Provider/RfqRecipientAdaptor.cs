using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class RfqRecipientAdaptor : IRfqRecipientAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public RfqRecipientAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<string> AddRfqRecipient(List<RfqRecipientRequestDto> rfqRecipientRequestDtos)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddRfqRecipient}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, rfqRecipientRequestDtos, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var message = responseModel.Data.ToString();
                    return message;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<bool> UpdateRfqRecipient(int rfqid,List<RfqRecipientRequestDto> rfqRecipientRequestDtos)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateRfqRecipient + rfqid}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, rfqRecipientRequestDtos, _globalClass.Token);
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

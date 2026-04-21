using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Infrastructure.Provider
{
    public class ReportAdaptor : IReportAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public ReportAdaptor(GlobalClass globalClass, IConfiguration config, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _globalClass = globalClass;
            _config = config;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<ReportDetailsResponseDto> GetReportDetails(ReportRequestDto request)
        {
            try
            {
                ReportDetailsResponseDto responseDto = new ReportDetailsResponseDto();
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetReportDetails}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, request, _globalClass.Token);
                if (responseModel != null)
                {
                    responseDto = JsonConvert.DeserializeObject<ReportDetailsResponseDto>(Convert.ToString(responseModel.Data!));
                }
                return responseDto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
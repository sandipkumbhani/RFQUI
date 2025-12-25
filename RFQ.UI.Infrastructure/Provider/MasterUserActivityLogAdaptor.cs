using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
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
using RFQ.UI.Domain.Helper;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MasterUserActivityLogAdaptor : IMasterUserActivityLogAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public MasterUserActivityLogAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<MasterUserActivityLogRequestDto?> AddMasterUserActivityLog(MasterUserActivityLogRequestDto requestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddMasterUserActivityLog}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, requestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200 && responseModel.Data != null)
                {
                    var dataToken = responseModel.Data as JToken ?? JToken.FromObject(responseModel.Data);
                    var userActivityLog = dataToken.ToObject<MasterUserActivityLogRequestDto>();
                    return userActivityLog;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<PageList<MasterUserActivityLogResponseDto>> GetAllMasterUserActivityLogList(PagingParam pagingParam)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllMasterUserActivityLogList}";
                    var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                    if (responseModel?.Data?.result != null)
                    {
                        var activityLog = JsonConvert.DeserializeObject<List<MasterUserActivityLogResponseDto>>(
                            JsonConvert.SerializeObject(responseModel.Data.result)
                        );
                        int pageNumber = responseModel.Data.pageNumber;
                        int pageSize = responseModel.Data.pageSize;
                        int totalRecordCount = responseModel.Data.totalRecordCount;
                        var displayColumns = responseModel.Data.displayColumns;
                        return new PageList<MasterUserActivityLogResponseDto>(activityLog, totalRecordCount, pageNumber, pageSize, displayColumns);
                    }
                    return null;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

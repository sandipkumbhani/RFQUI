using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
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
    public class RfqLinkAdaptor : IRfqLinkAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly ILogger<RfqLinkAdaptor> _logger;
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public RfqLinkAdaptor(IConfiguration configuration, ILogger<RfqLinkAdaptor> logger, HttpClient httpClient, IHttpContextAccessor httpContextAccessor, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _config = configuration;
            _logger = logger;
            _globalClass = new GlobalClass();
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<bool> AddRfqLinkData(List<RfqLinkRequestDto> rfqLinkRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddRfqLink}";
                string AuthToken = _httpContextAccessor.HttpContext?.Request.Cookies["AuthToken"];
                _globalClass.Token = AuthToken;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, rfqLinkRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200 && responseModel.Data == true.ToString())
                        return true;
                    else
                        return false;
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

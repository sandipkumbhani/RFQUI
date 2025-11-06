using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class RfqFinalAdaptor : IRfqFinalAdaptor
    {
        private readonly IConfiguration _config;
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public RfqFinalAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _globalClass = globalClass;
            _httpClient = httpClient;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<bool> AddRfqFinal(RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.AddRfqFinal;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, rfqFinalizationSaveRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var result = (bool)responseModel.Data;
                    return result;
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<VendorFinalizationResposeDto>> AwardedVendor(int id)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AwardedVendor + id}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var routeList = JsonConvert.DeserializeObject<IEnumerable<VendorFinalizationResposeDto>>(Convert.ToString(responseModel.Data!));
                    return routeList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<PageList<RfqFinalizationResponseDto>> GetAllRfqFinalization(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllRfqFinalization;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                if (responseModel != null)
                    return _commonApiAdaptor.GenerateResponse<RfqFinalizationResponseDto>(responseModel);
                else
                    return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<RfqFinalRateReponseDto>> GetRfqFinalRateList(int rfqFinalId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetRfqFinalRateList}?rfqFinalId={rfqFinalId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var resultList = JsonConvert.DeserializeObject<IEnumerable<RfqFinalRateReponseDto>>(Convert.ToString(responseModel.Data!));
                    return resultList;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<bool> UpdateRfqFinal(int rfqFinalId, RfqFinalizationSaveRequestDto rfqFinalizationSaveRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateRfqFinal + rfqFinalId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, rfqFinalizationSaveRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return true;
                else
                    return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<bool> DeleteRfqFinal(int rfqFinalId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["RfqFinal:DeleteRfqFinal"] + rfqFinalId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return (bool)responseModel.Data;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in DeleteRfqFinalization: " + ex.Message);
            }
            return false;
        }
        public async Task<IEnumerable<RfqDrpListResponseDto>> GetRfqDrpList(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetRfqDrpList}?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var resultList = JsonConvert.DeserializeObject<IEnumerable<RfqDrpListResponseDto>>(Convert.ToString(responseModel.Data!));
                    return resultList;
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

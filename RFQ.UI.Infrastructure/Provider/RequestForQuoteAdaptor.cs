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
    public class RequestForQuoteAdaptor : IRequestForQuoteAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public RequestForQuoteAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllVehicleIndentList}?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel?.Data != null)
                {
                    var indents = JsonConvert.DeserializeObject<IEnumerable<VehicleIndent>>(responseModel.Data.ToString());
                    return indents ?? Enumerable.Empty<VehicleIndent>();
                }
                return Enumerable.Empty<VehicleIndent>();
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> GetRfqNo()
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GenerateRfqAutoNo;
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel?.Data != null)
                {
                    var rfqNo = responseModel.Data.ToString();
                    return rfqNo;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<RequestForQuoteResponseDto> AddRfq(RequestForQuoteRequestDto requestForQouteRequestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.AddRfq;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, requestForQouteRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var rfqData = JsonConvert.DeserializeObject<RequestForQuoteResponseDto>(responseModel.Data.ToString());
                    return rfqData;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<RfqResponseDto> GetRfqByRfqNo(string rfqNo)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetRfqByRfqNo + rfqNo}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (responseModel.Data != null && result == 200)
                        return JsonConvert.DeserializeObject<RfqResponseDto>(responseModel.Data.ToString());
                    else
                        return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<RfqResponseDto> GetRfqById(int rfqId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetRfqById + rfqId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (responseModel.Data != null && result == 200)
                        return JsonConvert.DeserializeObject<RfqResponseDto>(responseModel.Data.ToString());
                    else
                        return null;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<RfqVendorListResponseDto>> GetAllVendorListForRfq(RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllVendorListForRfq}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, rfqVendorDetailsParam, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var rfqVendorListData = JsonConvert.DeserializeObject<IEnumerable<RfqVendorListResponseDto>>(responseModel.Data.ToString());
                    return rfqVendorListData;
                }
                return Enumerable.Empty<RfqVendorListResponseDto>();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<IEnumerable<RfqPreviousQuotesList>> GetPreviousQuotesList(RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetPreviousQuotesList}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, rfqVendorDetailsParam, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var QuotesList = JsonConvert.DeserializeObject<IEnumerable<RfqPreviousQuotesList>>(responseModel.Data.ToString());
                    return QuotesList;
                }
                return Enumerable.Empty<RfqPreviousQuotesList>();
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<RfqQuoteRateVendorDetails> GetRfqQuoteRateVendorDetailsqById(int rfqId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetRfqQuoteRateVendorDetails + rfqId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (responseModel.Data != null && result == 200)
                        return JsonConvert.DeserializeObject<RfqQuoteRateVendorDetails>(responseModel.Data.ToString());
                    else
                        return null;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<PageList<RfqListResponseDto>> GetAllRfq(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllRfq;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<RfqListResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string?> UpdateRfq(int rfqId, RequestForQuoteRequestDto requestForQuoteRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateRfq + rfqId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, requestForQuoteRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return Convert.ToString(responseModel.Data);
                else
                    throw new Exception(responseModel.ErrorMessage);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<bool> DeleteRfq(int rfqId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["RequestForQuote:DeleteRfq"] + rfqId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

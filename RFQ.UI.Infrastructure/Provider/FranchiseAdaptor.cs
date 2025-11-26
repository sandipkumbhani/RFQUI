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
    public class FranchiseAdaptor : IFranchiseAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public FranchiseAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<FranchiseRequestDto> AddFranchise(FranchiseRequestDto franchiseRequestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.AddFranchise;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, franchiseRequestDto, _globalClass.Token);
                if (responseModel?.StatusCode == 200 && responseModel.Data != null)
                    return JsonConvert.DeserializeObject<FranchiseRequestDto>(responseModel.Data.ToString());
                else
                    return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<string> DeleteFranchise(int companyId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}{_config["Franchise:DeleteFranchise"]}{companyId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Franchise Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to Delete Franchise";
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> EditFranchise(int companyId, FranchiseRequestDto franchiseRequestDto)
        {
            try
            {
                var baseurl = $"{_appSettings.BaseUrl + _appSettings.UpdateFranchise + companyId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseurl, franchiseRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Franchise Updated";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to update Franchise";
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<PageList<FranchiseResponseDto>> GetAllFranchise(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.FranchiseGetAllFranchise;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<FranchiseResponseDto>(responseModel);
            }

            catch (Exception)
            {
                throw;
            }
        }
    }
}

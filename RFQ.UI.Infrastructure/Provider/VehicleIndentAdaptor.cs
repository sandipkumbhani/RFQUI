using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.ComponentModel.Design;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class VehicleIndentAdaptor : IVehicleIndentAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public VehicleIndentAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<bool> AddVehicleIndent(VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddVehicleIndent}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, vehicleIndentRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<string> GetIndentNo()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GenerateVehicleIndent}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel?.Data != null)
                {
                    var indentNo = responseModel.Data.ToString();
                    return indentNo;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<PageList<VehicleIndentResponseDto>> GetAllVehicleIndent(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllVehicleIndent;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<VehicleIndentResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> UpdateVehicleIndent(int indentId, VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateVehicleIndent + indentId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, vehicleIndentRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "VehicleIndent Updated";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to update VehicleIndent";
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<bool> DeleteVehicleIndent(int indentId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/VehicleIndent/DeleteVehicleIndent/{indentId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return (bool)responseModel.Data;
                else
                    return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> IndentReferenceCheckInRfqAsync(int indentId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.IndentReferenceCheckInRfqAsync + indentId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return (bool)responseModel.Data;
                else
                    return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

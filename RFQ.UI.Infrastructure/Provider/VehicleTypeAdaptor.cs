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
    public class VehicleTypeAdaptor : IVehicleTypeAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public VehicleTypeAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettingsGlobal, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettingsGlobal;
            _commonApiAdaptor = commonApiAdaptor;
        }


        public async Task<NewCommonResponseDto> AddVehicleType(VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddVehicleType}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, vehicleTypeRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return JsonConvert.DeserializeObject<NewCommonResponseDto>(responseModel.Data.ToString());
                }
                return new NewCommonResponseDto();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PageList<VehicleTypeResponseDto>?> GetAllVehicleType(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllVehicleType;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<VehicleTypeResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> UpdateVehicleType(int vehicleTypeId, VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateVehicleType + vehicleTypeId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, vehicleTypeRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "VehicleType Updated";
                    else
                        return responseModel?.ErrorMessage ?? "";
                }
                return "Failed to update VehicleType";
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> DeleteVehicleType(int vehicleTypeId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_appSettings.BaseUrl + _config["VehicleType:DeleteVehicleType"] + vehicleTypeId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Profile Deleted";
                    else
                        return responseModel?.ErrorMessage ?? "";
                }
                return "Failed to Delete profile";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<VehicleTypeResponseDto?>> GetAllVehicleTypes()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllVehicleTypeList}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var vehicleTypelist = JsonConvert.DeserializeObject<List<VehicleTypeResponseDto>>(Convert.ToString(responseModel.Data!));
                    return vehicleTypelist;
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

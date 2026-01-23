using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
    public class VehiclePlacementAdaptor : IVehiclePlacementAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public VehiclePlacementAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }


        public async Task<VehiclePlacementRequestDto?> AddVehiclePlacement(VehiclePlacementRequestDto vehiclePlacementRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddVehiclePlacement}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, vehiclePlacementRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200 && responseModel.Data != null)
                {
                    var dataToken = responseModel.Data as JToken ?? JToken.FromObject(responseModel.Data);
                    var vehiclePlacementData = dataToken.ToObject<VehiclePlacementRequestDto>();
                    return vehiclePlacementData;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> GetPlacementNo()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GeneratePlacementNo}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel?.Data != null)
                {
                    var placementNo = responseModel.Data.ToString();
                    return placementNo;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<AutoFetchIndentResponseDto>> AutoFetchPlacement(int id)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AutoFetchPlacement + id}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var routeList = JsonConvert.DeserializeObject<IEnumerable<AutoFetchIndentResponseDto>>(Convert.ToString(responseModel.Data!));
                    return routeList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PageList<VehiclePlacementResponseDto>> GetAllVehiclePlacement(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllVehiclePlacement;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);

                return _commonApiAdaptor.GenerateResponse<VehiclePlacementResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> UpdateVehiclePlacement(int placementId, VehiclePlacementRequestDto vehiclePlacementRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateVehiclePlacement + placementId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, vehiclePlacementRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "VehiclePlacement Updated";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to update VehiclePlacement";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> DeleteVehiclePlacement(int placementId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_appSettings.BaseUrl + _appSettings.DeleteVehiclePlacement}{placementId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "VehicleIndent Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to Delete VehicleIndent";
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<VehiclePlacementResponseDto>> GetAllVehiclePlacementNo(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllVehiclePlacementNo}?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel?.Data != null)
                {
                    var indents = JsonConvert.DeserializeObject<IEnumerable<VehiclePlacementResponseDto>>(responseModel.Data.ToString());
                    return indents ?? Enumerable.Empty<VehiclePlacementResponseDto>();
                }
                return Enumerable.Empty<VehiclePlacementResponseDto>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> CheckVehicleAndIndentUnique(int vehicleId, int indentId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.CheckVehicleAndIndentUnique + vehicleId + "/" + indentId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return (bool)responseModel.Data;
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<AwardedIndentListResponseDto>> GetAwardedIndentList(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAwardedIndentList + companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var awardedIndentList = JsonConvert.DeserializeObject<IEnumerable<AwardedIndentListResponseDto>>(responseModel.Data.ToString());
                    return awardedIndentList ?? Enumerable.Empty<AwardedIndentListResponseDto>();
                }
                else
                {
                    return Enumerable.Empty<AwardedIndentListResponseDto>();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<int> GetVehiclePlacementCountByIndentNo(int indentId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetVehiclePlacementCountByIndentNo + indentId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    int count = JsonConvert.DeserializeObject<int>(responseModel.Data.ToString());
                    return count;
                }
                else
                    return 0;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> CheckAwardedVendor(CheckAwardedVendorRequestDto requestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.CheckAwardedVendor;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, requestDto, _globalClass.Token);

                if (responseModel != null && responseModel.StatusCode == 200)
                    return Convert.ToBoolean(responseModel.Data);
                else
                    return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

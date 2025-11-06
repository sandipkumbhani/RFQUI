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
    public class VehicleAdaptor : IVehicleAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public VehicleAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<IEnumerable<InternalMasterModel>> GetAllVehicleCategory()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllVehicleCategory}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var vehiclelist = JsonConvert.DeserializeObject<List<InternalMasterModel>>(Convert.ToString(responseModel.Data!));
                    return vehiclelist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto vehicleKycRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = $"{_config["ApiSettings:VehicleRCApiUrl"]}VehicleNo={vehicleKycRequestDto.VehicleNo}&UserId={vehicleKycRequestDto.UserId}&Username={vehicleKycRequestDto.Username}&serviceprovider={vehicleKycRequestDto.ServiceProvider}";

                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return null;
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                {
                    return null;
                }

                var vehicleList = JsonConvert.DeserializeObject<VehicleRCModelDto>(responseData);
                if (vehicleList == null)
                {
                    return null;
                }
                return vehicleList;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl}{_config["Vehicle:GetAllVehicleType"]}?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var vehicleTypelist = JsonConvert.DeserializeObject<List<ComMstVehicleTypeDto>>(Convert.ToString(responseModel.Data!));
                    return vehicleTypelist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllOwnerOrVendor}?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var ownerOrVendorlist = JsonConvert.DeserializeObject<List<MasterPartyDto>>(Convert.ToString(responseModel.Data!));
                    return ownerOrVendorlist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<string> AddVehicle(VehicleRequestDto vehicleRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddVehicle}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, vehicleRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return responseModel.Data.ToString();
                    else
                        return string.Empty;
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<PageList<VehicleSpResponseDto>> GetAllVehicle(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllVehicle}";
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                if (responseModel?.Data?.result != null)
                {
                    var vehicleList = JsonConvert.DeserializeObject<List<VehicleSpResponseDto>>(
                        JsonConvert.SerializeObject(responseModel.Data.result)
                    );

                    int pageNumber = responseModel.Data.pageNumber;
                    int pageSize = responseModel.Data.pageSize;
                    int totalRecordCount = responseModel.Data.totalRecordCount;

                    return new PageList<VehicleSpResponseDto>(vehicleList, totalRecordCount, pageNumber, pageSize, responseModel.Data.displayColumns);
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> EditVehicle(int vehicleId, VehicleRequestDto vehicleRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateVehicle + vehicleId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, vehicleRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return responseModel.Message;
                    else
                        return string.Empty;
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> DeleteVehicle(int vehicleId)
        {
            try
            {
                
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _appSettings.BaseUrl + _config["Vehicle:DeleteVehicle"] + vehicleId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return responseModel.Message;
                    else
                        return string.Empty;
                }
                return string.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<List<VehicleResponseDto?>> GetVehicleNumber()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetVehicleNumber}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var vehicleNumberlist = JsonConvert.DeserializeObject<List<VehicleResponseDto>>(Convert.ToString(responseModel.Data!));
                    return vehicleNumberlist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

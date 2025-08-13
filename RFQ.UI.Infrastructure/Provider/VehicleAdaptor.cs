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
        private string _fleetLynkApiUrl;

        public VehicleAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
        }

        public async Task<IEnumerable<InternalMasterModel>> GetAllVehicleCategory()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Vehicle:GetAllVehicleCategory"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = $"{_fleetLynkApiUrl}{_config["Vehicle:GetAllVehicleType"]}?companyId={companyId}";
                var response = await _httpClient.GetAsync(url);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
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

        public async Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Vehicle:GetAllOwnerOrVendor"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Vehicle:AddVehicle"];
                var vehicle = JsonConvert.SerializeObject(vehicleRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return responseModel.Message;
                    }
                    else
                    {
                        return string.Empty;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return string.Empty;
        }

        public async Task<PageList<VehicleResponseDto>> GetAllVehicle(PagingParam pagingParam)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                    var requestDto = JsonConvert.SerializeObject(pagingParam);
                    var requestContent = new StringContent(requestDto, Encoding.UTF8, "application/json");

                    var baseUrl = _fleetLynkApiUrl + _config["Vehicle:GetAllVehicle"];
                    var response = await httpClient.PostAsync(baseUrl, requestContent);
                    var responseData = await response.Content.ReadAsStringAsync();

                    var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);

                    if (responseModel?.Data?.result != null)
                    {
                        var vehicleList = JsonConvert.DeserializeObject<List<VehicleResponseDto>>(
                            JsonConvert.SerializeObject(responseModel.Data.result)
                        );

                        int pageNumber = responseModel.Data.pageNumber;
                        int pageSize = responseModel.Data.pageSize;
                        int totalRecordCount = responseModel.Data.totalRecordCount;

                        return new PageList<VehicleResponseDto>(vehicleList, totalRecordCount, pageNumber, pageSize);
                    }

                    return null;
                }
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

                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Vehicle:UpdateVehicle"] + vehicleId;
                var vehicle = JsonConvert.SerializeObject(vehicleRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
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

        public async Task<string> DeleteVehicle(int vehicleId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Vehicle:DeleteVehicle"] + vehicleId;
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
            }
            catch (Exception ex)
            {
                throw;
            }
            return string.Empty;
        }

        public async Task<List<VehicleResponseDto?>> GetVehicleNumber()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Vehicle:GetVehicleNumber"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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

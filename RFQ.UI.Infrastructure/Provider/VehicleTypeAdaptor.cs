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
        private string _fleetLynkApiUrl;

        public VehicleTypeAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }


        public async Task<string> AddVehicleType(VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["VehicleType:AddVehicleType"];
                var Vehicle = JsonConvert.SerializeObject(vehicleTypeRequestDto);
                var requestContent = new StringContent(Vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Vehicle Saved";
                    else
                        return responseModel?.ErrorMessage ?? "";
                }
                return string.Empty;
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
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["VehicleType:GetAllVehicleType"];
                var param = JsonConvert.SerializeObject(pagingParam);
                var requestContent = new StringContent(param, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null && responseModel.Data != null)
                {
                    var json = JsonConvert.SerializeObject(responseModel.Data.result);
                    var typedList = JsonConvert.DeserializeObject<List<VehicleTypeResponseDto>>(json);
                    dynamic parsed = JsonConvert.DeserializeObject<dynamic>(responseData);
                    int pageNumber = parsed.data.pageNumber;
                    int pageSize = parsed.data.pageSize;
                    int totalPage = parsed.data.totalPage;
                    int totalRecordCount = parsed.data.totalRecordCount;

                    return new PageList<VehicleTypeResponseDto>(typedList, totalRecordCount, pageNumber, pageSize);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> UpdateVehicleType(int vehicleTypeId, VehicleTypeRequestDto vehicleTypeRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = _fleetLynkApiUrl + _config["VehicleType:UpdateVehicleType"] + vehicleTypeId;
                var vehicle = JsonConvert.SerializeObject(vehicleTypeRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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
            catch (Exception)
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

                var baseurl = _fleetLynkApiUrl + _config["VehicleType:DeleteVehicleType"] + vehicleTypeId;
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
    }
}

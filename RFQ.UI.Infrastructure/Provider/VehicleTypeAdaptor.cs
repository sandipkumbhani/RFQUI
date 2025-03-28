using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;
using System.Text;
using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Infrastructure.Provider
{
    public class VehicleTypeAdaptor : IVehicleTypeAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;

        public VehicleTypeAdaptor(HttpClient httpClient, GlobalClass globalClass,IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }


        public async Task<string> AddVehicleType(VehicleTypeViewModelDto vehicleTypeViewModelDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var baseurl = $"{_fleetLynkApiUrl}/MasterVehicleType/AddMasterVehicleType";
            var Vehicle = JsonConvert.SerializeObject(vehicleTypeViewModelDto);
            var requestContent = new StringContent(Vehicle, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {

                    return "Vehicle Saved";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return string.Empty;
        }

        public async Task<IEnumerable<VehicleTypeViewModelDto>> GetVehicleTypeAll()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync($"{_fleetLynkApiUrl}/MasterVehicleType/GetAllMasterVehicleType");
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var Profilelist = JsonConvert.DeserializeObject<List<VehicleTypeViewModelDto>>(Convert.ToString(responseModel.Data!));
                return Profilelist;
            }
                return null;
        }

        public async Task<string> EditVehicleType(int vehicleTypeId, VehicleTypeViewModelDto vehicleTypeViewModelDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/MasterVehicleType/UpdateMasterVehicleType/{vehicleTypeId}";
            var vehicle = JsonConvert.SerializeObject(vehicleTypeViewModelDto);
            var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "VehicleType Updated";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return "Failed to update VehicleType";
        }

        public async Task<string> DeleteVehicleType(int vehicleTypeId)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/MasterVehicleType/DeleteMasterVehicleType/{vehicleTypeId}";
            var response = await _httpClient.DeleteAsync(baseurl);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "Profile Deleted";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return "Failed to Delete profile";
        }
    }
}

using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;
using System.Net.Http;

namespace RFQ.UI.Infrastructure.Provider
{
    public class VehicleAdaptor : IVehicleAdaptor
    {
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;

        public VehicleAdaptor(GlobalClass globalClass, IConfiguration configuration)
        {
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
        }

        public async Task<IEnumerable<InternalMasterDto>> GetAllVehicleCategory()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"{_fleetLynkApiUrl}/MasterVehicleType/GetAllVehicleCategory");
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var vehiclelist = JsonConvert.DeserializeObject<List<InternalMasterDto>>(Convert.ToString(responseModel.Data!));
                    return vehiclelist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto requestDto)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = $"{_config["ApiSettings:VehicleRCApiUrl"]}VehicleNo={requestDto.VehicleNo}&UserId={requestDto.UserId}&Username={requestDto.Username}&serviceprovider={requestDto.ServiceProvider}";

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

        public async Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"{_fleetLynkApiUrl}/MasterVehicleType/GetAllMasterVehicleType");
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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

    }
}

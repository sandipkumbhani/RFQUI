using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;
using System.Net.Http;

namespace RFQ.UI.Infrastructure.Provider
{
    public class VehicleAdaptor : IVehicleAdaptor
    {
        private readonly GlobalClass _globalClass;

        public VehicleAdaptor(GlobalClass globalClass)
        {
            _globalClass = globalClass;
        }

        public async Task<IEnumerable<InternalMasterDto>> GetAllVehicleCategory()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"https://localhost:7272/api/MasterVehicleType/GetAllVehicleCategory");
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

        //public async Task<ApiResponseDTO> GetVehicleKycDetails()
        //{
        //    try
        //    {
        //        var _httpClient = new HttpClient();
        //        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
        //        var response = await _httpClient.GetAsync($"http://103.172.151.71/RSuiteKYCTest/VehicleRCAPI/GetVehicleRCInfo?VehicleNo=MH47A9009&UserId=1&Username=abc&serviceprovider=ulip");
        //        var responseData = await response.Content.ReadAsStringAsync();
        //        var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
        //        if (responseModel != null)
        //        {
        //            var vehiclelist = JsonConvert.DeserializeObject<ApiResponseDTO>(Convert.ToString(responseModel.Data!));
        //            return vehiclelist;
        //        }
        //        return null;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}

        public async Task<VehicleRCModelDto?> GetVehicleKycDetails()
        {
            try
            {
                var _httpClient = new HttpClient();
                // Set Authorization header
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                // API URL
                var url = "http://103.172.151.71/RSuiteKYCTest/VehicleRCAPI/GetVehicleRCInfo?" +
                          "VehicleNo=MH47A9009&UserId=1&Username=abc&serviceprovider=ulip";

                // Make the request
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    // Log or handle the error (optional)
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return null;
                }

                // Read response content
                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                {
                    Console.WriteLine("Response content is empty.");
                    return null;
                }

                // Deserialize response
                var vehicleList = JsonConvert.DeserializeObject<VehicleRCModelDto>(responseData);
                if (vehicleList == null)
                {
                    Console.WriteLine("Response model or data is null.");
                    return null;
                }
                return vehicleList;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
                throw; // Re-throwing the exception for better stack trace
            }
        }

    }
}

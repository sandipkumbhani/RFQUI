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
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseUrl = _fleetLynkApiUrl + _config["VehicleIndent:AddVehicleIndent"];
                var vehicleIndent = JsonConvert.SerializeObject(vehicleIndentRequestDto);
                var requestContent = new StringContent(vehicleIndent, Encoding.UTF8, "application/json");
                var response = await httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddVehicleIndent: {ex.Message}");
            }
            return false;
        }

        public async Task<string> GetIndentNo()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["VehicleIndent:GenerateVehicleIndent"];
                var response = await _httpClient.GetAsync(baseurl);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return null;
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                    return null;

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel?.Data != null)
                {
                    var indentNo = responseModel.Data.ToString();
                    return indentNo;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
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

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/VehicleIndent/UpdateVehicleIndent/{indentId}";
                var vehicle = JsonConvert.SerializeObject(vehicleIndentRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "VehicleIndent Updated";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to update VehicleIndent";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> DeleteVehicleIndent(int indentId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/VehicleIndent/DeleteVehicleIndent/{indentId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "VehicleIndent Deleted";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to Delete VehicleIndent";
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

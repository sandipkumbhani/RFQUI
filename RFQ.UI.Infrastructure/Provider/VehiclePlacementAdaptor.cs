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
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public VehiclePlacementAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        
        public async Task<VehiclePlacementRequestDto?> AddVehiclePlacement(VehiclePlacementRequestDto vehiclePlacementRequestDto)
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = $"{_fleetLynkApiUrl}/VehiclePlacement/AddVehiclePlacement";
                var jsonPayload = JsonConvert.SerializeObject(vehiclePlacementRequestDto);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(baseUrl, content);
                var responseData = await response.Content.ReadAsStringAsync();

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);

                if (responseModel != null && responseModel.StatusCode == 200 && responseModel.Data != null)
                {

                    var dataToken = responseModel.Data as JToken ?? JToken.FromObject(responseModel.Data);
                    var vehiclePlacementData = dataToken.ToObject<VehiclePlacementRequestDto>();
                    return vehiclePlacementData;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in AddRfq: " + ex.Message);
            }

            return null;

        }

        public async Task<string> GetPlacementNo()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["VehiclePlacement:GeneratePlacementNo"];
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
                    var placementNo = responseModel.Data.ToString();
                    return placementNo;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }

        public async Task<IEnumerable<AutoFetchIndentResponseDto>> AutoFetchPlacement(int id)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = _fleetLynkApiUrl + _config["VehiclePlacement:AutoFetchPlacement"] + id;
                var response = await _httpClient.GetAsync(url);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var routeList = JsonConvert.DeserializeObject<IEnumerable<AutoFetchIndentResponseDto>>(Convert.ToString(responseModel.Data!));
                    return routeList;
                }
                return null;

            }
            catch (Exception ex)
            {
                throw new Exception("An error in AutoFetchPlacement.", ex);
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

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/VehiclePlacement/UpdateVehiclePlacement/{placementId}";
                var vehicle = JsonConvert.SerializeObject(vehiclePlacementRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "VehiclePlacement Updated";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
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

                var baseurl = $"{_fleetLynkApiUrl}/VehiclePlacement/DeleteVehiclePlacement/{placementId}";
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

        public async Task<IEnumerable<VehiclePlacementResponseDto>> GetAllVehiclePlacementNo(int companyId)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = $"{_fleetLynkApiUrl}{_config["VehiclePlacement:GetAllVehiclePlacementNo"]}?companyId={companyId}";
                var response = await _httpClient.GetAsync(baseUrl);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return Enumerable.Empty<VehiclePlacementResponseDto>();
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                    return Enumerable.Empty<VehiclePlacementResponseDto>();

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);

                if (responseModel?.Data != null)
                {
                    var indents = JsonConvert.DeserializeObject<IEnumerable<VehiclePlacementResponseDto>>(responseModel.Data.ToString());
                    return indents ?? Enumerable.Empty<VehiclePlacementResponseDto>();
                }

                return Enumerable.Empty<VehiclePlacementResponseDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in GetAllVehiclePlacementNo: {ex}");
                return Enumerable.Empty<VehiclePlacementResponseDto>();
            }
        }
    }
}

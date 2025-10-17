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
    public class DriverAdaptor : IDriverAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public DriverAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<DriverRequestDto> AddDriver(DriverRequestDto driverRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Driver:AddDriver"];
                var driver = JsonConvert.SerializeObject(driverRequestDto);
                var requestContent = new StringContent(driver, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return JsonConvert.DeserializeObject<DriverRequestDto>(responseModel.Data.ToString());
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }

        public async Task<string> DeleteDriver(int DriverId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Driver:DeleteDriver"] + DriverId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Driver Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return "Failed to Delete Driver";
        }

        public async Task<string> EditDriver(int DriverId, DriverRequestDto driverRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Driver:UpdateDriver"] + DriverId;
                var driver = JsonConvert.SerializeObject(driverRequestDto);
                var requestContent = new StringContent(driver, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();  
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Driver Updated";
                    else
                        return responseModel.ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return "Failed to update Driver";
        }

        public async Task<PageList<DriverResponseDto>?> GetAllDriver(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.DriverGetAllDrivers;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);

                return _commonApiAdaptor.GenerateResponse<DriverResponseDto>(responseModel);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<LicenseKycDetailsResponseDto> GetDlKycDetails(LicenseKycDetailsRequestDto licenseKycDetailsRequestDto)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var url = $"{_config["ApiSettings:DrivingLicenseAPI"]}DrivingLicenseNo={licenseKycDetailsRequestDto.DrivingLicenseNo}&DateOfBirth={licenseKycDetailsRequestDto.DateOfBirth}";
                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"HTTP Request failed with status code: {response.StatusCode}");
                    return null;
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                {
                    Console.WriteLine("Response data is null or empty");
                    return null;
                }

                var settings = new JsonSerializerSettings
                {
                    DateTimeZoneHandling = DateTimeZoneHandling.RoundtripKind
                };

                var dlKycDetails = JsonConvert.DeserializeObject<LicenseKycDetailsResponseDto>(responseData, settings);
                if (dlKycDetails == null)
                {
                    Console.WriteLine("Deserialization resulted in null");
                    return null;
                }

                // Adjust DateTime fields to correct the 1-day discrepancy  
                if (dlKycDetails.DrivingLicenseModel != null)
                {
                    dlKycDetails.DrivingLicenseModel.ValidityIssueDate = dlKycDetails.DrivingLicenseModel.ValidityIssueDate.AddDays(1);
                    dlKycDetails.DrivingLicenseModel.ValidityExpiryDate = dlKycDetails.DrivingLicenseModel.ValidityExpiryDate.AddDays(1);
                }

                return dlKycDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex}");
                throw;
            }
        }

        public async Task<IEnumerable<InternalMasterResponseDto>> GetDriverType()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync(_fleetLynkApiUrl + _config["Driver:GetDriverType"]);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var driverList = JsonConvert.DeserializeObject<List<InternalMasterResponseDto>>(Convert.ToString(responseModel.Data!));
                    return driverList;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex}");
                throw;
            }
        }

        public async Task<IEnumerable<DriverResponseDto>> GetAllDriverList()
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = (_fleetLynkApiUrl + _config["Driver:GetAllDriverList"]);
                var response = await _httpClient.GetAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var ProfileList = JsonConvert.DeserializeObject<List<DriverResponseDto>>(Convert.ToString(responseModel.Data!));
                    return ProfileList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> GetDriverCode()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Driver:GenerateDriverCode"];
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
                    var driverCode = responseModel.Data.ToString();
                    return driverCode;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }
    }
}

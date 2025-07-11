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
        public DriverAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
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
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Driver:GetAllDriver"];
                var param = JsonConvert.SerializeObject(pagingParam);
                var requestContent = new StringContent(param, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null && responseModel.Data != null)
                {
                    var json = JsonConvert.SerializeObject(responseModel.Data.result);
                    var typedList = JsonConvert.DeserializeObject<List<DriverResponseDto>>(json);
                    dynamic parsed = JsonConvert.DeserializeObject<dynamic>(responseData);
                    int pageNumber = parsed.data.pageNumber;
                    int pageSize = parsed.data.pageSize;
                    int totalPage = parsed.data.totalPage;
                    int totalRecordCount = parsed.data.totalRecordCount;

                    return new PageList<DriverResponseDto>(typedList, totalRecordCount, pageNumber, pageSize);
                }
                return null;
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
    }
}

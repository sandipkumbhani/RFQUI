using Microsoft.AspNetCore.Http;
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
                var baseUrl = _appSettings.BaseUrl + _appSettings.AddDriver;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, driverRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return JsonConvert.DeserializeObject<DriverRequestDto>(responseModel.Data.ToString());
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
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
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateDriver + DriverId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, driverRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    return "Driver Updated";
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
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
                var baseUrl = $"{_config["ApiSettings:DrivingLicenseAPI"]}DrivingLicenseNo={licenseKycDetailsRequestDto.DrivingLicenseNo}&DateOfBirth={licenseKycDetailsRequestDto.DateOfBirth}";

                var responseModel = await _commonApiAdaptor.GetAsync<LicenseKycDetailsResponseDto>(baseUrl);
                if (responseModel != null)
                {
                    if (responseModel.MessageDescription != null)
                    {
                        throw new Exception(responseModel.MessageDescription);
                    }
                    // Adjust DateTime fields to correct the 1-day discrepancy  
                    if (responseModel.DrivingLicenseModel != null)
                    {
                        responseModel.DrivingLicenseModel.ValidityIssueDate = responseModel.DrivingLicenseModel.ValidityIssueDate.AddDays(1);
                        responseModel.DrivingLicenseModel.ValidityExpiryDate = responseModel.DrivingLicenseModel.ValidityExpiryDate.AddDays(1);
                    }
                    return responseModel;
                }
                return null;
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
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetDriverType;
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
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
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllDriverList;
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
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

        public async Task<string> GetDriverCode(int UserId)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GenerateDriverCode + UserId;
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel?.Data != null)
                {
                    var driverCode = responseModel.Data.ToString();
                    return driverCode;
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

using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.ComponentModel.Design;
using System.Text;
using System.Text.Json;

namespace RFQ.UI.Infrastructure.Provider
{
    public class CustomerAdaptor : ICustomerAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public CustomerAdaptor(HttpClient httpClient, GlobalClass globalClass, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<NewCommonResponseDto> AddCustomer(CustomerRequestDto customerRequestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + "/MasterParty/AddMasterParty";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, customerRequestDto, _globalClass.Token);
                if (responseModel == null)
                {
                    return new NewCommonResponseDto
                    {
                        StatusCode = responseModel.StatusCode,
                        Message = "No response received from API",
                        Data = null
                    };
                }

                if (responseModel.StatusCode == 200)
                {
                    var customerData = JsonConvert.DeserializeObject<CustomerRequestDto>(responseModel.Data.ToString());
                    return new NewCommonResponseDto
                    {
                        StatusCode = 200,
                        Message = responseModel.Message,
                        Data = customerData
                    };
                }

                if (responseModel.StatusCode == 409)
                {
                    return new NewCommonResponseDto
                    {
                        StatusCode = 409,
                        Message = "Duplicate record found. Party details already exist.",
                        Data = null
                    };
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<string> DeleteCustomer(int PartyId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _appSettings.BaseUrl + "/MasterParty/DeleteMasterParty/" + PartyId;
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Customer Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return "Failed to Delete Customer";
        }

        public async Task<string> EditCustomer(int PartyId, CustomerRequestDto customerRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl}/MasterParty/UpdateMasterParty/{PartyId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, customerRequestDto, _globalClass.Token );
                if (responseModel != null && responseModel.StatusCode == 200)
                    return "Customer Updated";
                else
                    throw new Exception("Failed to update Customer");
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("409"))
                    throw new Exception("Customer already exists 409");
                else
                    throw new Exception("Failed to update Customer");
            }
        }

        public async Task<PageList<CustomerResponseDto>> GetAllCustomer(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.CustomerGetAllCustomer;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<CustomerResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<GstKycDetailsDto> GetGstKycDetails(GstKycDetailsRequestDto gstKycDetailsRequestDto)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var url = $"{_appSettings.GstApiUrl}GSTNo={gstKycDetailsRequestDto.GSTNo}&ccode={gstKycDetailsRequestDto.CCode}&UserId={gstKycDetailsRequestDto.UserId}";
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return null;

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                    return null;

                var gstKycDetails = JsonConvert.DeserializeObject<GstKycDetailsDto>(responseData);
                if (gstKycDetails == null)
                    return null;
                return gstKycDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
                throw;
            }
        }

        public async Task<PanKycDetailModel> GetPanKycDetails(PanKycDetailRequestDto panKycDetailRequestDto)
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var url = $"{_appSettings.PanApiUrl}PANNo={panKycDetailRequestDto.PANNo}&ccode={panKycDetailRequestDto.CCode}&UserId={panKycDetailRequestDto.UserId}";
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return null;

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                    return null;

                var panKycDetails = JsonConvert.DeserializeObject<PanKycDetailModel>(responseData);
                if (panKycDetails == null)
                    return null;
                return panKycDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<ComMstCityDto>> GetAllCity()
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + "/CompanyCity/GetAllCity";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var CityList = JsonConvert.DeserializeObject<List<ComMstCityDto>>(Convert.ToString(responseModel.Data!));
                    return CityList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<CustomerRequestDto>> GetDrpCustomerList(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl}/MasterParty/GetDrpCustomerList?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var customerList = JsonConvert.DeserializeObject<List<CustomerRequestDto>>(Convert.ToString(responseModel.Data!));
                    return customerList;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string?> GetAutoCustomerCode(int UserId)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.CustomerGetAutoCustomerCode + UserId;
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null && responseModel.Data != null)
                {
                    return responseModel.Data.ToString();
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error fetching auto customer code.", ex);
            }
        }
    }
}

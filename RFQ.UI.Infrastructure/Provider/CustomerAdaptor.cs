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
    public class CustomerAdaptor : ICustomerAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        public CustomerAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
        }
        public async Task<NewCommonResponseDto> AddCustomer(CustomerRequestDto customerRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Customer:AddMasterParty"];
                var customer = JsonConvert.SerializeObject(customerRequestDto);
                var requestContent = new StringContent(customer, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel == null)
                {
                    return new NewCommonResponseDto
                    {
                        StatusCode = (int)response.StatusCode,
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

                return new NewCommonResponseDto
                {
                    StatusCode = (int)response.StatusCode,
                    Message = "Unexpected response from API",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return null;
            }
            return null;
        }

        public async Task<string> DeleteCustomer(int PartyId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Customer:DeleteMasterParty"] + PartyId;
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
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Customer:UpdateMasterParty"] + PartyId;
                var customer = JsonConvert.SerializeObject(customerRequestDto);
                var requestContent = new StringContent(customer, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Customer Updated";
                    else
                        return responseModel.ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return "Failed to update Customer";
        }

        public async Task<PageList<CustomerResponseDto>> GetAllCustomer(PagingParam pagingParam)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                    var requestDto = JsonConvert.SerializeObject(pagingParam);
                    var requestContent = new StringContent(requestDto, Encoding.UTF8, "application/json");

                    var baseUrl = _fleetLynkApiUrl + _config["Customer:GetAllCustomer"];
                    var response = await httpClient.PostAsync(baseUrl, requestContent);
                    var responseData = await response.Content.ReadAsStringAsync();

                    var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);

                    if (responseModel?.Data?.result != null)
                    {
                        var profileList = JsonConvert.DeserializeObject<List<CustomerResponseDto>>(
                            JsonConvert.SerializeObject(responseModel.Data.result)
                        );

                        int pageNumber = responseModel.Data.pageNumber;
                        int pageSize = responseModel.Data.pageSize;
                        int totalRecordCount = responseModel.Data.totalRecordCount;

                        return new PageList<CustomerResponseDto>(profileList, totalRecordCount, pageNumber, pageSize);
                    }
                    return null;
                }
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

                var url = $"{_config["ApiSettings:GstApiUrl"]}GSTNo={gstKycDetailsRequestDto.GSTNo}&ccode={gstKycDetailsRequestDto.CCode}&UserId={gstKycDetailsRequestDto.UserId}";
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

                var url = $"{_config["ApiSettings:PanApiUrl"]}PANNo={panKycDetailRequestDto.PANNo}&ccode={panKycDetailRequestDto.CCode}&UserId={panKycDetailRequestDto.UserId}";
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
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = _fleetLynkApiUrl + _config["Customer:GetAllCity"];
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
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var url = $"{_fleetLynkApiUrl}{_config["Customer:GetDrpCustomerList"]}?companyId={companyId}";
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return null;
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                    return null;

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
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
    }
}

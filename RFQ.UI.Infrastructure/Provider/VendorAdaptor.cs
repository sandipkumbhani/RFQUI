using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Data;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class VendorAdaptor : IVendorAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public VendorAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<NewCommonResponseDto> AddVendor(VendorRequestDto vendorRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _config["Vendor:AddMasterParty"]}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, vendorRequestDto, _globalClass.Token);

                if (responseModel != null && responseModel.StatusCode == 200)
                {
                    var vendorData = JsonConvert.DeserializeObject<VendorRequestDto>(responseModel.Data.ToString());
                    return new NewCommonResponseDto
                    {
                        StatusCode = 200,
                        Message = responseModel.Message,
                        Data = vendorData
                    };
                } else
                {
                    throw new Exception("Failed to add Vendor");
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> DeleteVendor(int PartyId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = $"{_appSettings.BaseUrl + _config["Vendor:DeleteMasterParty"] + PartyId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Vendor Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to Delete Vendor";
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> EditVendor(int PartyId, VendorRequestDto vendorRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.UpdateMasterParty + PartyId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, vendorRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Vendor Updated";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to update Vendor";
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IEnumerable<InternalMasterResponseDto>> GetAllInternalMaster()
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl+_appSettings.GetAllInternalMaster}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var internalMasterList = JsonConvert.DeserializeObject<List<InternalMasterResponseDto>>(Convert.ToString(responseModel.Data!));
                    return internalMasterList;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<VendorResponseDto>> GetAllVendor(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllVendor;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<VendorResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<VendorListResponseDto>?> GetAllVendorList(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetAllVendorList}?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel?.Data != null)
                {
                    var vendorList = JsonConvert.DeserializeObject<List<VendorListResponseDto>>(responseModel.Data.ToString());
                    return vendorList;
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

using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MasterAttachmentAdaptor : IMasterAttachmentAdaptor
    {
        private HttpClient _httpClient;
        private object _fleetLynkApiUrl;
        private readonly IConfiguration _config;
        private readonly GlobalClass _globalClass;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public MasterAttachmentAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<string> AddMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl}/MasterAttachment/AddMasterAttachment";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, masterAttachmentRequestDto, _globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Corporate Company Saved";
                    else
                        return responseModel.ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return string.Empty;
        }
        public async Task<IEnumerable<MasterAttachmentRequestDto>> GetAllMasterAttachment()
        {
            {
                try
                {
                    var baseUrl = $"{_appSettings.BaseUrl}/MasterAttachment/GetAllMasterAttachment";
                    var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                    if (responseModel != null)
                    {
                        var masterattachmentlist = JsonConvert.DeserializeObject<List<MasterAttachmentRequestDto>>(Convert.ToString(responseModel.Data!));
                        return masterattachmentlist;
                    }
                    return null;
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }
        public async Task<IEnumerable<MasterAttachmentTypeResponseDto>> GetAllMasterAttachmentType()
        {
            try
            {
                var baseUrl = $"{_fleetLynkApiUrl}/MasterAttachmentType/GetAllMasterAttachmentType";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var masterattachmentlist = JsonConvert.DeserializeObject<List<MasterAttachmentTypeResponseDto>>(Convert.ToString(responseModel.Data!));
                    return masterattachmentlist;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<IEnumerable<MasterAttachmentResponseDto>> DeleteMasterAttachment(int attachmentId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/MasterAttachment/DeleteMasterAttachment/{attachmentId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        var attachmentList = JsonConvert.DeserializeObject<List<MasterAttachmentResponseDto>>(Convert.ToString(responseModel.Data!));
                        return attachmentList;
                    }
                    else
                    {
                        return null;
                    }
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> DeleteMasterAttachmentTable(int attachmentId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/MasterAttachment/DeleteMasterAttachmentTable/{attachmentId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "MasterAttachment Deleted";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to Delete MasterAttachmentTable";
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<string> UpdateMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl}/MasterAttachment/UpdateMasterAttachment";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, masterAttachmentRequestDto,_globalClass.Token);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Corporate Company Updated";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to update Corporate Company";
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

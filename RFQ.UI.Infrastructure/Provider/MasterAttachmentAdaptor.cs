using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Models;

namespace RFQ.UI.Infrastructure.Provider
{
    public class MasterAttachmentAdaptor : IMasterAttachmentAdaptor
    {
        private HttpClient _httpClient;
        private object _fleetLynkApiUrl;
        private readonly IConfiguration _config;
        private readonly GlobalClass _globalClass;

        public MasterAttachmentAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"];
        }
        public async Task<string> AddMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = "https://localhost:7272/api/MasterAttachment/AddMasterAttachment";
                var company = JsonConvert.SerializeObject(masterAttachmentRequestDto);
                var requestContent = new StringContent(company, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {

                        return "Corporate Company Saved";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return string.Empty;
        }

        public async Task<IEnumerable<MasterAttachmentRequestDto>> GetAllMasterAttachment()
        {
            {
                try
                {
                    var _httpClient = new HttpClient();
                    _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                    var response = await _httpClient.GetAsync($"https://localhost:7272/api/MasterAttachment/GetAllMasterAttachment");
                    var responseData = await response.Content.ReadAsStringAsync();
                    var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"https://localhost:7272/api/MasterAttachmentType/GetAllMasterAttachmentType");
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/MasterAttachment/DeleteMasterAttachment/{attachmentId}";
            var response = await _httpClient.DeleteAsync(baseurl);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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

        public async Task<string> DeleteMasterAttachmentTable(int attachmentId)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/MasterAttachment/DeleteMasterAttachmentTable/{attachmentId}";
            var response = await _httpClient.DeleteAsync(baseurl);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
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
        public async Task<string> UpdateMasterAttachment(List<MasterAttachmentRequestDto> masterAttachmentRequestDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/MasterAttachment/UpdateMasterAttachment";    
            var vehicle = JsonConvert.SerializeObject(masterAttachmentRequestDto);
            var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "Corporate Company Updated";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return "Failed to update Corporate Company";
        }
    }
}

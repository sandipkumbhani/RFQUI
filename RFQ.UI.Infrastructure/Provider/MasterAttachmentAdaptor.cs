using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        private readonly GlobalClass _globalClass;

        public MasterAttachmentAdaptor(HttpClient httpClient, GlobalClass globalClass)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
        }
        public async Task<string> AddMasterAttachment(MasterAttachmentRequestDto masterAttachmentRequestDto)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = "https://localhost:7272/api/MasterAttachment/GetMasterAttachment";
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

        
    }
}

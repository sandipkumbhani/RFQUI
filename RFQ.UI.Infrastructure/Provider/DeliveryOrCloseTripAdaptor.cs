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
    public class DeliveryOrCloseTripAdaptor : IDeliveryOrCloseTripAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;

        public DeliveryOrCloseTripAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<string> GenerateDocumentNo()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var baseurl = _fleetLynkApiUrl + _config["Delivery:GenerateDocumentNo"];
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
                    var lrNo = responseModel.Data.ToString();
                    return lrNo;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }

        public async Task<DeliveryOrCloseTripRequestDto?> AddDelivery(DeliveryOrCloseTripRequestDto deliveryOrCloseTripRequestDto)
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = $"{_fleetLynkApiUrl}/Delivery/AddDelivery";
                var jsonPayload = JsonConvert.SerializeObject(deliveryOrCloseTripRequestDto);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(baseUrl, content);
                var responseData = await response.Content.ReadAsStringAsync();

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);

                if (responseModel != null && responseModel.StatusCode == 200 && responseModel.Data != null)
                {

                    var dataToken = responseModel.Data as JToken ?? JToken.FromObject(responseModel.Data);
                    var DeliveryData = dataToken.ToObject<DeliveryOrCloseTripRequestDto>();
                    return DeliveryData;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in AddDelivery: " + ex.Message);
            }

            return null;
        }

        public async Task<PageList<DeliveryOrCloseTripResponseDto>> GetAllDelivery(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllDelivery;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);

                return _commonApiAdaptor.GenerateResponse<DeliveryOrCloseTripResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> UpdateDelivery(int deliveryId, DeliveryOrCloseTripRequestDto deliveryOrCloseTripRequestDto)
        {
            try
            {

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/Delivery/UpdateDelivery/{deliveryId}";
                var vehicle = JsonConvert.SerializeObject(deliveryOrCloseTripRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return " Updated";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to update Delivery";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> DeleteDelivery(int deliveryId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/Delivery/DeleteDelivery/{deliveryId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "Delivery Deleted";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to Delete Delivery";
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

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
    public class BookingOrTripAdaptor : IBookingOrTripAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private string _fleetLynkApiUrl;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public BookingOrTripAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _fleetLynkApiUrl = _config["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_config), "BaseUrl configuration is missing");
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }

        public async Task<BookingOrTripRequestDto?> AddBookingOrTrip(BookingOrTripRequestDto bookingOrTripRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AddBookingOrTrip}";
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, bookingOrTripRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200 && responseModel.Data != null)
                {
                    var dataToken = responseModel.Data as JToken ?? JToken.FromObject(responseModel.Data);
                    var bookingOrTripData = dataToken.ToObject<BookingOrTripRequestDto>();
                    return bookingOrTripData;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<PageList<BookingOrTripResponseDto>> GetAllBookingOrTrip(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllBookingOrTrip;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);

                return _commonApiAdaptor.GenerateResponse<BookingOrTripResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> UpdateBookingOrTrip(int bookingId, BookingOrTripRequestDto bookingOrTripRequestDto)
        {
            try
            {

                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/BookingOrTrip/UpdateBookingOrTrip/{bookingId}";
                var vehicle = JsonConvert.SerializeObject(bookingOrTripRequestDto);
                var requestContent = new StringContent(vehicle, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync(baseurl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "bookingOrTrip Updated";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to update bookingOrTrip";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<string> DeleteBookingOrTrip(int bookingId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_fleetLynkApiUrl}/bookingOrTrip/DeleteBookingOrTrip/{bookingId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                    {
                        return "bookingOrTrip Deleted";
                    }
                    else
                    {
                        return responseModel.ErrorMessage;
                    }
                }
                return "Failed to Delete bookingOrTrip";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<BookingOrTripResponseDto>> GetAllLRNo(int companyId)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseUrl = $"{_fleetLynkApiUrl}{_config["bookingOrTrip:GetAllLRNo"]}?companyId={companyId}";
                var response = await _httpClient.GetAsync(baseUrl);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    return Enumerable.Empty<BookingOrTripResponseDto>();
                }

                var responseData = await response.Content.ReadAsStringAsync();
                if (string.IsNullOrWhiteSpace(responseData))
                    return Enumerable.Empty<BookingOrTripResponseDto>();

                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);

                if (responseModel?.Data != null)
                {
                    var lrNoList  = JsonConvert.DeserializeObject<IEnumerable<BookingOrTripResponseDto>>(responseModel.Data.ToString());
                    return lrNoList ?? Enumerable.Empty<BookingOrTripResponseDto>();

                }

                return Enumerable.Empty<BookingOrTripResponseDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in GetAllLRNo: {ex}");
                return Enumerable.Empty<BookingOrTripResponseDto>();
            }
        }

        public async Task<IEnumerable<AutoFetchBookingResponseDto>> AutoFetchBooking(int id)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.AutoFetchBooking + id}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var routeList = JsonConvert.DeserializeObject<IEnumerable<AutoFetchBookingResponseDto>>(Convert.ToString(responseModel.Data!));
                    return routeList;
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

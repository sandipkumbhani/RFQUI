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
    public class LocationAdaptor : ILocationAdaptor
    {
        private  HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _configuration;
        private string _fleetLynkApiUrl;

        public LocationAdaptor(HttpClient httpClient,GlobalClass globalClass,IConfiguration configuration)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _configuration = configuration;
            _fleetLynkApiUrl = _configuration["ApiSettings:BaseUrl"] ?? throw new ArgumentNullException(nameof(_configuration), "BaseUrl configuration is missing");

        }
        public async Task<string> AddLocation(LocationRequestDto locationRequestDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer",_globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/MasterLocation/AddMasterLocation";

            var User = JsonConvert.SerializeObject(locationRequestDto);
            var requestContent = new StringContent(User, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "Location Saved";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return string.Empty;
        }

        public async Task<string> DeleteLocation(int LocationId)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/Masterlocation/DeleteMasterLoction/{LocationId}";
            var response = await _httpClient.DeleteAsync(baseurl);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "location Deleted";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return "Failed to Delete location";

        }

        public async Task<string> EditLocation(int LocationId, LocationRequestDto locationRequestDto)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

            var baseurl = $"{_fleetLynkApiUrl}/Masterlocation/UpdateMasterlocation/{LocationId}";
            var user = JsonConvert.SerializeObject(locationRequestDto);
            var requestContent = new StringContent(user, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(baseurl, requestContent);
            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var result = responseModel.StatusCode;
                if (result == 200)
                {
                    return "location Updated...";
                }
                else
                {
                    return responseModel.ErrorMessage;
                }
            }
            return "Failed to Update location ";
        }

        public async Task<IEnumerable<LocationResponseDto>> GetAllLocation()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
            var response = await _httpClient.GetAsync($"{_fleetLynkApiUrl}/Masterlocation/GetAllMasterlocation");

            var responseData = await response.Content.ReadAsStringAsync();
            var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
            if (responseModel != null)
            {
                var ProfileList = JsonConvert.DeserializeObject<List<LocationResponseDto>>(Convert.ToString(responseModel.Data!));
                return ProfileList;
            }
            return null;
        }
    }
}

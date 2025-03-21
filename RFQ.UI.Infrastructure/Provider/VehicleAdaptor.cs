using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Models;

namespace RFQ.UI.Infrastructure.Provider
{
   public class VehicleAdaptor: IVehicleAdaptor
    {
        private readonly GlobalClass _globalClass;

        public VehicleAdaptor(GlobalClass globalClass)
        {
            _globalClass = globalClass;
        }

        public async Task<IEnumerable<InternalMasterDto>> GetAllVehicleCategory()
        {
            try
            {
                var _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);
                var response = await _httpClient.GetAsync($"https://localhost:7272/api/MasterVehicleType/GetAllVehicleCategory");
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var vehiclelist = JsonConvert.DeserializeObject<List<InternalMasterDto>>(Convert.ToString(responseModel.Data!));
                    return vehiclelist;
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

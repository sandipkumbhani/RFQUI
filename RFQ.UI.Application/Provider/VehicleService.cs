using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Provider
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleAdaptor _vehicleAdaptor;
        public VehicleService(IVehicleAdaptor vehicleAdaptor)
        {
            _vehicleAdaptor = vehicleAdaptor ?? throw new ArgumentNullException(nameof(vehicleAdaptor));
        }
        public async Task<IEnumerable<InternalMasterDto>> GetAllVehicleCategory()
        {
            return await _vehicleAdaptor.GetAllVehicleCategory();
        }
    }
}

using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Provider
{
    public class VehicleIndentService : IVehicleIndentService
    {
        private readonly IVehicleIndentAdaptor _vehicleIndentAdaptor;
        public VehicleIndentService(IVehicleIndentAdaptor vehicleIndentAdaptor)
        {
            _vehicleIndentAdaptor = vehicleIndentAdaptor;
        }

        public async Task<bool> AddVehicleIndent(VehicleIndentRequestDto vehicleIndentRequestDto)
        {
            return await _vehicleIndentAdaptor.AddVehicleIndent(vehicleIndentRequestDto);
        }
    }
}

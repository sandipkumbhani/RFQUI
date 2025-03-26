using RFQ.UI.Application.Interface;
using RFQ.UI.Infrastructure.Provider;
using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Application.Provider
{
    public class VehicleTypeServices : IVehicleTypeServices
    {
        private readonly VehicleTypeAdaptor _vehicleTypeAdaptor;

        public VehicleTypeServices(VehicleTypeAdaptor vehicleTypeAdaptor)
        {
            _vehicleTypeAdaptor = vehicleTypeAdaptor;
        }
        public Task<string> AddVehicleType(VehicleTypeViewModelDto vehicleTypeViewModelDto)
        {
            return _vehicleTypeAdaptor.AddVehicleType(vehicleTypeViewModelDto);
        }

        public Task<string> DeleteVehicleType(int vehicleTypeId)
        {
            return _vehicleTypeAdaptor.DeleteVehicleType(vehicleTypeId);
        }

        public Task<string> EditVehicleType(int vehicleTypeId, VehicleTypeViewModelDto vehicleTypeViewModelDto)
        {
            return _vehicleTypeAdaptor.EditVehicleType(vehicleTypeId, vehicleTypeViewModelDto);
        }

        public Task<IEnumerable<VehicleTypeViewModelDto>> GetVehicleTypeAll()
        {
            return _vehicleTypeAdaptor.GetVehicleTypeAll();
        }
    }
}

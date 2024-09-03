using RFQ.UI.Application.Inteface;
using RFQ.UI.Infrastructure.Provider;
using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Application.Provider
{
    public class VehicletypeServices : IVehicletypeServices
    {
        private readonly VehicleTypeAdaptor _vehicleTypeAdaptor;

        public VehicletypeServices(VehicleTypeAdaptor vehicleTypeAdaptor)
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

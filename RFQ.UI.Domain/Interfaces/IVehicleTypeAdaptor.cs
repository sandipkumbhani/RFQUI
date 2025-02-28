using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleTypeAdaptor
    {
        Task<string> AddVehicleType(VehicleTypeViewModelDto vehicleTypeViewModelDto);

        Task<IEnumerable<VehicleTypeViewModelDto>> GetVehicleTypeAll();

        Task<string> EditVehicleType(int vehicleTypeId, VehicleTypeViewModelDto vehicleTypeViewModelDto);

        Task<string> DeleteVehicleType(int vehicleTypeId);

    }
}

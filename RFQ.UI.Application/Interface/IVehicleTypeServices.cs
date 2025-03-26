using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Application.Interface
{
    public interface IVehicleTypeServices
    {
        Task<string> AddVehicleType(VehicleTypeViewModelDto vehicleTypeViewModelDto);

        Task<IEnumerable<VehicleTypeViewModelDto>> GetVehicleTypeAll();

        Task<string> EditVehicleType(int vehicleTypeId, VehicleTypeViewModelDto vehicleTypeViewModelDto);

        Task<string> DeleteVehicleType(int vehicleTypeId);
    }
}

using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using static RFQ.UI.Domain.Model.VehicleTypeViewModel;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleTypeAdaptor
    {
        Task<string> AddVehicleType(VehicleTypeRequestDto vehicleTypeViewModelDto);

        Task<List<VehicleTypeResponseDto>?> GetVehicleTypeAll();

        Task<string> UpdateVehicleType(int vehicleTypeId, VehicleTypeRequestDto vehicleTypeViewModelDto);

        Task<string> DeleteVehicleType(int vehicleTypeId);
        
    }
}

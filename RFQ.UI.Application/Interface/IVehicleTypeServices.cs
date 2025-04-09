using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IVehicleTypeServices
    {
        Task<string> AddVehicleType(VehicleTypeRequestDto vehicleTypeViewModelDto);

        Task<List<VehicleTypeResponseDto>> GetVehicleTypeAll();

        Task<string> UpdateVehicleType(int vehicleTypeId, VehicleTypeRequestDto vehicleTypeViewModelDto);

        Task<string> DeleteVehicleType(int vehicleTypeId);
    }
}

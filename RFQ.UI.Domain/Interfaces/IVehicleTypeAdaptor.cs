using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;


namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleTypeAdaptor
    {
        Task<string> AddVehicleType(VehicleTypeRequestDto vehicleTypeRequestDto);

        Task<List<VehicleTypeResponseDto>?> GetVehicleTypeAll();

        Task<string> UpdateVehicleType(int vehicleTypeId, VehicleTypeRequestDto vehicleTypeRequestDto);

        Task<string> DeleteVehicleType(int vehicleTypeId);
        
    }
}

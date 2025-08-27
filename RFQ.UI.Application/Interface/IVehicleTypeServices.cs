using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IVehicleTypeServices
    {
        Task<NewCommonResponseDto> AddVehicleType(VehicleTypeRequestDto vehicleTypeRequestDto);

        Task<PageList<VehicleTypeResponseDto>> GetVehicleTypeAll(PagingParam pagingParam);

        Task<string> UpdateVehicleType(int vehicleTypeId, VehicleTypeRequestDto vehicleTypeRequestDto);

        Task<string> DeleteVehicleType(int vehicleTypeId);

        Task<List<VehicleTypeResponseDto?>> GetAllVehicleTypes();
    }
}

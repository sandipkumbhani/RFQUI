using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IVehicleService
    {
        Task<IEnumerable<InternalMasterModel>> GetAllVehicleCategory();
        Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto requestDto);
        Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType();
        Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor();
        Task<VehicleRequestDto> AddVehicle(VehicleRequestDto vehicleRequestDto);
        Task<IEnumerable<VehicleResponseDto>> GetAllVehicle();
        Task<string> EditVehicle(VehicleRequestDto vehicleRequestDto);
        Task<string> DeleteVehicle(int VehicleId);
    }
}

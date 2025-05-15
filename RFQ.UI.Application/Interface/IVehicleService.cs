using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IVehicleService
    {
         Task<IEnumerable<InternalMasterModel>> GetAllVehicleCategory();
        Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto vehicleKycRequestDto);
        Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType();
        Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor();
        Task<String> AddVehicle(VehicleRequestDto vehicleRequestDto);
        Task<IEnumerable<VehicleResponseDto>> GetAllVehicle();
        Task<string> EditVehicle(int vehicleId, VehicleRequestDto vehicleRequestDto);
        Task<string> DeleteVehicle(int vehicleId);
    }
}

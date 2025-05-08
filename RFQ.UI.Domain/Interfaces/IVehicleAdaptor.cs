using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleAdaptor
    {
        Task<String> AddVehicle(VehicleRequestDto vehicleRequestDto);
        Task<IEnumerable<VehicleResponseDto>> GetAllVehicle();
        Task<string> EditVehicle(VehicleRequestDto vehicleRequestDto);
        Task<string> DeleteVehicle(int VehicleId);
        Task<IEnumerable<InternalMasterModel>> GetAllVehicleCategory();

        Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto vehicleKycRequestDto);

        Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType();
        Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor();
    }
}

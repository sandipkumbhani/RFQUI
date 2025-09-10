using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleAdaptor
    {
        Task<String> AddVehicle(VehicleRequestDto vehicleRequestDto);
        Task<PageList<VehicleSpResponseDto>> GetAllVehicle(PagingParam pagingParam);
        Task<string> EditVehicle(int vehicleId, VehicleRequestDto vehicleRequestDto);
        Task<string> DeleteVehicle(int vehicleId);
        Task<IEnumerable<InternalMasterModel>> GetAllVehicleCategory();
        Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto vehicleKycRequestDto);
        Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType(int companyId); 
        Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor(int companyId);
        Task<List<VehicleResponseDto?>> GetVehicleNumber();
    }
}

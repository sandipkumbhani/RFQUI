using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleAdaptor
    {
        Task<IEnumerable<InternalMasterModel>> GetAllVehicleCategory();

        Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto vehicleKycRequestDto);

        Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType();
        Task<IEnumerable<MasterPartyDto>> GetAllOwnerOrVendor();
    }
}

using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IVehicleService
    {
         Task<IEnumerable<InternalMasterDto>> GetAllVehicleCategory();
        Task<VehicleRCModelDto> GetVehicleKycDetails(VehicleKycRequestDto requestDto);
        Task<IEnumerable<ComMstVehicleTypeDto>> GetAllMasterVehicleType();
    }
}

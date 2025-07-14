using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IMasterPartyVehicleTypeService
    {
        Task<IEnumerable<MasterPartyVehicleTypeResponseDto>> GetMasterPartyVehicleTypeByPartyId(int id);
        Task<string> DeleteMasterPartyVehicleTypeById(int id);

    }
}

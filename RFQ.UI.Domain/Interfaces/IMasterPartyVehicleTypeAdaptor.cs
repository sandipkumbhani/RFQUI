using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IMasterPartyVehicleTypeAdaptor
    {
        Task<IEnumerable<MasterPartyVehicleTypeResponseDto>?> GetMasterPartyVehicleTypeByPartyId(int id);
        Task<string?> DeleteMasterPartyVehicleTypeById(int id);
    }
}

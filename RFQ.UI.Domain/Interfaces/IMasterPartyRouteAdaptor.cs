using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IMasterPartyRouteAdaptor
    {
        Task<IEnumerable<MasterPartyRouteResponseDto>> GetMasterPartyRouteByPartyId(int id);
        Task<string> DeleteMasterPartyRouteById(int id);
    }
}

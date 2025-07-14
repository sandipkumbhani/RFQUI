using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IMasterPartyRouteService
    {
        Task<IEnumerable<MasterPartyRouteResponseDto>> GetMasterPartyRouteByPartyId(int id);
        Task<string> DeleteMasterPartyRouteById(int id);
    }
}

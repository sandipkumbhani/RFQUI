using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class MasterPartyRouteService : IMasterPartyRouteService
    {
        private readonly MasterPartyRouteAdaptor _masterPartyRouteAdaptor;
        public MasterPartyRouteService(MasterPartyRouteAdaptor masterPartyRouteAdaptor)
        {
            _masterPartyRouteAdaptor = masterPartyRouteAdaptor;
        }

        public Task<string> DeleteMasterPartyRouteById(int id)
        {
            return _masterPartyRouteAdaptor.DeleteMasterPartyRouteById(id);
        }

        public Task<IEnumerable<MasterPartyRouteResponseDto>> GetMasterPartyRouteByPartyId(int id)
        {
            return _masterPartyRouteAdaptor.GetMasterPartyRouteByPartyId(id);
        }
    }
}

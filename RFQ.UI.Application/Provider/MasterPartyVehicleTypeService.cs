using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class MasterPartyVehicleTypeService : IMasterPartyVehicleTypeService
    {
        private readonly MasterPartyVehicleTypeAdaptor _masterPartyVehicleTypeAdaptor;
        public MasterPartyVehicleTypeService(MasterPartyVehicleTypeAdaptor masterPartyVehicleTypeAdaptor)
        {
            _masterPartyVehicleTypeAdaptor = masterPartyVehicleTypeAdaptor;
        }

        public Task<string> DeleteMasterPartyVehicleTypeById(int id)
        {
            return _masterPartyVehicleTypeAdaptor.DeleteMasterPartyVehicleTypeById(id);
        }

        public Task<IEnumerable<MasterPartyVehicleTypeResponseDto>> GetMasterPartyVehicleTypeByPartyId(int id)
        {
            return _masterPartyVehicleTypeAdaptor.GetMasterPartyVehicleTypeByPartyId(id);
        }
    }
}

using RFQ.UI.Domain.Model;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleAdaptor
    {
        public Task<IEnumerable<InternalMasterDto>> GetAllVehicleCategory();
    }
}

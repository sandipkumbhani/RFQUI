using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Inteface
{
    public interface IVehicleService
    {
        public Task<IEnumerable<InternalMasterDto>> GetAllVehicleCategory();
    }
}

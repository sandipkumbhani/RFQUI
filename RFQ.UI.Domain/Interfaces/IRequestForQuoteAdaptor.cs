using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRequestForQuoteAdaptor
    {
        Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList();
    }
}

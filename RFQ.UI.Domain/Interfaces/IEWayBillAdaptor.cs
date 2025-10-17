using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IEWayBillAdaptor
    {
        Task<IEnumerable<TripDetailsResponse>> GetTripDetailsByBillExpiryDate(TripDetailsRequestDto tripDetailsRequestDto);
    }
}

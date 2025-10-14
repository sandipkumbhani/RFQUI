using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class EWayBillService : IEWayBillService
    {

        private readonly IEWayBillAdaptor _eWayBillAdaptor;
        public EWayBillService(IEWayBillAdaptor eWayBillAdaptor)
        {
            _eWayBillAdaptor = eWayBillAdaptor;
        }
        public async Task<IEnumerable<TripDetailsResponse>> GetTripDetailsByBillExpiryDate(TripDetailsRequestDto tripDetailsRequestDto)
        {
            return await _eWayBillAdaptor.GetTripDetailsByBillExpiryDate(tripDetailsRequestDto);
        }
    }
}

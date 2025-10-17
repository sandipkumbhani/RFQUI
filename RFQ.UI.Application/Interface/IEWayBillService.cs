using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface IEWayBillService
    {
        Task<IEnumerable<TripDetailsResponse>> GetTripDetailsByBillExpiryDate(TripDetailsRequestDto tripDetailsRequestDto);
    }
}

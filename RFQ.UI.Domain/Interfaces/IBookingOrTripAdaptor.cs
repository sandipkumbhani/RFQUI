using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IBookingOrTripAdaptor
    {
        Task<BookingOrTripRequestDto?> AddBookingOrTrip(BookingOrTripRequestDto bookingOrTripRequestDto);
        Task<PageList<BookingOrTripResponseDto>> GetAllBookingOrTrip(PagingParam pagingParam);
        Task<string> UpdateBookingOrTrip(int bookingId, BookingOrTripRequestDto bookingOrTripRequestDto);
        Task<string> DeleteBookingOrTrip(int bookingId);
        Task<IEnumerable<BookingOrTripResponseDto>> GetAllLRNo(int companyId);
        Task<IEnumerable<AutoFetchBookingResponseDto>> AutoFetchBooking(int id);
    }
}

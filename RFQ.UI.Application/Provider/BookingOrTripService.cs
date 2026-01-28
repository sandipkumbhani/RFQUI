using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class BookingOrTripService : IBookingOrTripService
    {
        private readonly IBookingOrTripAdaptor _bookingOrTripAdaptor;
        public BookingOrTripService(IBookingOrTripAdaptor bookingOrTripAdaptor)
        {
            _bookingOrTripAdaptor = bookingOrTripAdaptor;
        }

        public async Task<BookingOrTripRequestDto?> AddBookingOrTrip(BookingOrTripRequestDto bookingOrTripRequestDto)
        {
            return await _bookingOrTripAdaptor.AddBookingOrTrip(bookingOrTripRequestDto);
        }

        public async Task<IEnumerable<AutoFetchBookingResponseDto>> AutoFetchBooking(int id)
        {
            return await _bookingOrTripAdaptor.AutoFetchBooking(id);
        }

        public async Task<string> DeleteBookingOrTrip(int bookingId)
        {
            return await _bookingOrTripAdaptor.DeleteBookingOrTrip(bookingId);
        }

        public async Task<PageList<BookingOrTripResponseDto>> GetAllBookingOrTrip(PagingParam pagingParam)
        {
            return await _bookingOrTripAdaptor.GetAllBookingOrTrip(pagingParam);
        }

        public Task<IEnumerable<BookingOrTripResponseDto>> GetAllLRNo(int companyId)
        {
            return _bookingOrTripAdaptor.GetAllLRNo(companyId);
        }

        public async Task<string> UpdateBookingOrTrip(int bookingId, BookingOrTripRequestDto bookingOrTripRequestDto)
        {
            return await _bookingOrTripAdaptor.UpdateBookingOrTrip(bookingId, bookingOrTripRequestDto);
        }
    }
}

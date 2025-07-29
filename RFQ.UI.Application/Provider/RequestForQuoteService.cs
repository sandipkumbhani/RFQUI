using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class RequestForQuoteService : IRequestForQuoteService
    {
        private readonly IRequestForQuoteAdaptor _requestForQuoteAdaptor;
        public RequestForQuoteService(IRequestForQuoteAdaptor requestForQuoteAdaptor)
        {
            _requestForQuoteAdaptor = requestForQuoteAdaptor;
        }

        public Task<RfqRequestDto?> AddRfq(RfqRequestDto RfqRequestDto)
        {
            return _requestForQuoteAdaptor.AddRfq(RfqRequestDto);
        }

        public Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList()
        {
            return _requestForQuoteAdaptor.GetAllVehicleIndentList();
        }

        public async Task<IEnumerable<RfqVendorListResponseDto>> GetAllVendorListForRfq(RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            return await _requestForQuoteAdaptor.GetAllVendorListForRfq(rfqVendorDetailsParam);
        }
        public async Task<RfqResponseDto> GetRfqByRfqNo(string rfqNo)
        {
            return await _requestForQuoteAdaptor.GetRfqByRfqNo(rfqNo);
        }

        public Task<string> GetRfqNo()
        {
            return _requestForQuoteAdaptor.GetRfqNo();
        }
        public async Task<RfqResponseDto> GetRfqById(int rfqId)
        {
            return await _requestForQuoteAdaptor.GetRfqById(rfqId);
        }
    }
}

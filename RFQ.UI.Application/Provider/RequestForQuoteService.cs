using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
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

        public Task<RequestForQuoteResponseDto> AddRfq(RequestForQuoteRequestDto requestForQouteRequestDto)
        {
            return _requestForQuoteAdaptor.AddRfq(requestForQouteRequestDto);
        }

        public Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList(int companyId)
        {
            return _requestForQuoteAdaptor.GetAllVehicleIndentList(companyId);
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
        public async Task<IEnumerable<RfqPreviousQuotesList>> GetPreviousQuotesList(RfqVendorDetailsParam rfqVendorDetailsParam)
        {
            return await _requestForQuoteAdaptor.GetPreviousQuotesList(rfqVendorDetailsParam);
        }

        public async Task<RfqQuoteRateVendorDetails> GetRfqQuoteRateVendorDetailsqById(int rfqId)
        {
            return await _requestForQuoteAdaptor.GetRfqQuoteRateVendorDetailsqById(rfqId);
        }

        public async Task<PageList<RfqListResponseDto>> GetAllRfq(PagingParam pagingParam)
        {
            return await _requestForQuoteAdaptor.GetAllRfq(pagingParam);
        }

        public async Task<string> UpdateRfq(int rfqId, RequestForQuoteRequestDto requestForQuoteRequestDto)
        {
            return await _requestForQuoteAdaptor.UpdateRfq(rfqId, requestForQuoteRequestDto);
        }

        public async Task<bool> DeleteRfq(int rfqId)
        {
            return await _requestForQuoteAdaptor.DeleteRfq(rfqId);
        }
    }
}

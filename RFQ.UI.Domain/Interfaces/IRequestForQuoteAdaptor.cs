using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRequestForQuoteAdaptor
    {
        Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList(int companyId);
        Task<string> GetRfqNo();
        Task<RequestForQuoteResponseDto> AddRfq(RequestForQuoteRequestDto requestForQouteRequestDto);
        Task<PageList<RfqListResponseDto>> GetAllRfq(PagingParam pagingParam);
        Task<string> UpdateRfq(int rfqId, RequestForQuoteRequestDto requestForQuoteRequestDto);
        Task<bool> DeleteRfq(int rfqId);
        Task<RfqResponseDto> GetRfqByRfqNo(string rfqNo);
        Task<RfqResponseDto> GetRfqById(int rfqId);
        Task<IEnumerable<RfqVendorListResponseDto>> GetAllVendorListForRfq(RfqVendorDetailsParam rfqVendorDetailsParam);
        Task<IEnumerable<RfqPreviousQuotesList>> GetPreviousQuotesList(RfqVendorDetailsParam rfqVendorDetailsParam);
        Task<RfqQuoteRateVendorDetails> GetRfqQuoteRateVendorDetailsqById(int rfqId);
    }
}

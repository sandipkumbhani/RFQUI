using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IRequestForQuoteService
    {
        Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList();
        Task<string> GetRfqNo();
        Task<RequestForQuoteResponseDto> AddRfq(RequestForQuoteRequestDto requestForQouteRequestDto);
        Task<RfqResponseDto> GetRfqByRfqNo(string rfqNo);
        Task<RequestForQuoteResponseDto> GetRfqById(int rfqId);
        Task<IEnumerable<RfqVendorListResponseDto>> GetAllVendorListForRfq(RfqVendorDetailsParam rfqVendorDetailsParam);
    }
}

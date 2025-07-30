using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IRequestForQuoteService
    {
        Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList();
        Task<string> GetRfqNo();
        Task<bool> AddRfq(RequestForQouteRequestDto requestForQouteRequestDto);
        Task<RfqResponseDto> GetRfqByRfqNo(string rfqNo);
        Task<RfqResponseDto> GetRfqById(int rfqId);
        Task<IEnumerable<RfqVendorListResponseDto>> GetAllVendorListForRfq(RfqVendorDetailsParam rfqVendorDetailsParam);
    }
}

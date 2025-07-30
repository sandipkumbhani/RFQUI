using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRequestForQuoteAdaptor
    {
        Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList();
        Task<string> GetRfqNo();
        Task<RfqResponseDto> AddRfq(RequestForQouteRequestDto requestForQouteRequestDto);
        Task<RfqResponseDto> GetRfqByRfqNo(string rfqNo);
        Task<RfqResponseDto> GetRfqById(int rfqId);
        Task<IEnumerable<RfqVendorListResponseDto>> GetAllVendorListForRfq(RfqVendorDetailsParam rfqVendorDetailsParam);

    }
}

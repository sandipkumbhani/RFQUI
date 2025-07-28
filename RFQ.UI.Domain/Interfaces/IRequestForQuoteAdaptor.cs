using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRequestForQuoteAdaptor
    {
        Task<IEnumerable<VehicleIndent>> GetAllVehicleIndentList();
        Task<string> GetRfqNo();
        Task<RfqRequestDto?> AddRfq(RfqRequestDto RfqRequestDto);
        Task<RfqResponseDto> GetRfqByRfqNo(string rfqNo);
        Task<IEnumerable<RfqVendorListResponseDto>> GetAllVendorListForRfq(RfqVendorDetailsParam rfqVendorDetailsParam);

    }
}

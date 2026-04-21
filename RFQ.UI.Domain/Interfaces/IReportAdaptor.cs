using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IReportAdaptor
    {
        Task<ReportDetailsResponseDto> GetReportDetails(ReportRequestDto request);
    }
}

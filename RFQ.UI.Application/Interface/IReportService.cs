using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IReportService
    {
        Task<ReportDetailsResponseDto> GetReportDetails(ReportRequestDto request);
    }
}

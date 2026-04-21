using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Provider
{
    public class ReportService: IReportService
    {
        private readonly IReportAdaptor _reportAdaptor;

        public ReportService(IReportAdaptor reportAdaptor )
        {
            _reportAdaptor = reportAdaptor;
        }
        public async Task<ReportDetailsResponseDto> GetReportDetails(ReportRequestDto request)
        {
            return await _reportAdaptor.GetReportDetails(request);
        }
    }
}

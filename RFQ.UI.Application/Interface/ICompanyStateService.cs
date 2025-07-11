using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICompanyStateService
    {
        Task<List<CompanyStateResponseDto>> GetAllStateList();
    }
}

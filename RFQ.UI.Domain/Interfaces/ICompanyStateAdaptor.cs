using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICompanyStateAdaptor
    {
        Task<List<CompanyStateResponseDto>> GetAllStateList();
    }
}

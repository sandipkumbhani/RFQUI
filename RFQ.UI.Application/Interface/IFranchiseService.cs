using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IFranchiseService
    {
        Task<string> AddFranchise(FranchiseRequestDto franchiseRequestDto);
        Task<IEnumerable<FranchiseResponseDto>> GetFranchiseAll();
        Task<string> EditFranchise(int companyId, FranchiseRequestDto franchiseRequestDto);
        Task<string> DeleteFranchise(int companyId);
    }
}

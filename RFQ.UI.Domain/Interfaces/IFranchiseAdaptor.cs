using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IFranchiseAdaptor
    {
        Task<FranchiseRequestDto> AddFranchise(FranchiseRequestDto franchiseRequestDto);
        Task<IEnumerable<FranchiseResponseDto>> GetFranchiseAll();
        Task<string> EditFranchise(int companyId, FranchiseRequestDto franchiseRequestDto);
        Task<string> DeleteFranchise(int companyId);
    }

}

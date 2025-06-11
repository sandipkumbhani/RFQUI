using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IFranchiseAdaptor
    {
        Task<FranchiseRequestDto> AddFranchise(FranchiseRequestDto franchiseRequestDto);
        Task<PageList<FranchiseResponseDto>> GetAllFranchise(PagingParam pagingParam);
        Task<string> EditFranchise(int companyId, FranchiseRequestDto franchiseRequestDto);
        Task<string> DeleteFranchise(int companyId);
    }

}

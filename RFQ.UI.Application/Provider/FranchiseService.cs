using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class FranchiseService : IFranchiseService
    {
        private readonly FranchiseAdaptor _franchiseAdaptor;
        public FranchiseService(FranchiseAdaptor franchiseAdaptor)
        {
            _franchiseAdaptor = franchiseAdaptor;
        }
        //public Task<FranchiseRequestDto> AddFranchise(FranchiseRequestDto franchiseRequestDto)
        //{
        //    return _franchiseAdaptor.AddFranchise(franchiseRequestDto);
        //}

        public Task<FranchiseRequestDto> AddFranchise(FranchiseRequestDto franchiseRequestDto)
        {
            return _franchiseAdaptor.AddFranchise(franchiseRequestDto);
        }


        public Task<string> DeleteFranchise(int companyId)
        {
            return _franchiseAdaptor.DeleteFranchise(companyId);
        }

        public Task<string> EditFranchise(int companyId, FranchiseRequestDto franchiseRequestDto)
        {
            return _franchiseAdaptor.EditFranchise(companyId, franchiseRequestDto);
        }

        public async Task<PageList<FranchiseResponseDto>> GetAllFranchise(PagingParam pagingParam)
        {
            return await _franchiseAdaptor.GetAllFranchise(pagingParam);
        }
    }
}

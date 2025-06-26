using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICompanyMasterPackingTypeAdaptor
    {
        Task<string> AddMasterPackingType(CompanyMasterPackingTypeRequestDto companyMasterPackingTypeRequestDto);

        Task<IEnumerable<CompanyMasterPackingTypeResponseDto>> GetAllMasterPackingType();
    }
}

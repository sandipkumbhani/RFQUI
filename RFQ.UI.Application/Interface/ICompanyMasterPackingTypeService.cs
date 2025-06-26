using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICompanyMasterPackingTypeService
    {
        Task<string> AddMasterPackingType(CompanyMasterPackingTypeRequestDto companyMasterPackingTypeRequestDto);

        Task<IEnumerable<CompanyMasterPackingTypeResponseDto>> GetAllMasterPackingType();

    }
}

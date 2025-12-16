using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ICustomerAdaptor
    {
        Task<NewCommonResponseDto> AddCustomer(CustomerRequestDto customerRequestDto);

        Task<PageList<CustomerResponseDto>> GetAllCustomer(PagingParam pagingParam);

        Task<string> EditCustomer(int PartyId, CustomerRequestDto customerRequestDto);

        Task<string> DeleteCustomer(int PartyId);

        Task<GstKycDetailsDto> GetGstKycDetails(GstKycDetailsRequestDto gstKycDetailsRequestDto);

        Task<PanKycDetailModel> GetPanKycDetails(PanKycDetailRequestDto panKycDetailRequestDto);

        Task<IEnumerable<ComMstCityDto>> GetAllCity();
        Task<IEnumerable<CustomerRequestDto>> GetDrpCustomerList(int companyId);
        Task<string?> GetAutoCustomerCode(int UserId);
    }
}

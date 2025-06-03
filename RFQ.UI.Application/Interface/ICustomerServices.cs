using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICustomerServices
    {
        Task<CustomerRequestDto> AddCustomer(CustomerRequestDto customerRequestDto);

        Task<IEnumerable<CustomerResponseDto>> GetAllCustomer(DataTableRequest request);

        Task<string> EditCustomer(int PartyId, CustomerRequestDto customerRequestDto);

        Task<string> DeleteCustomer(int PartyId);

        Task<GstKycDetailsDto> GetGstKycDetails(GstKycDetailsRequestDto gstKycDetailsRequestDto);

        Task<PanKycDetailModel> GetPanKycDetails(PanKycDetailRequestDto panKycDetailRequestDto);

        Task<IEnumerable<ComMstCityDto>> GetAllCity();
    }
}

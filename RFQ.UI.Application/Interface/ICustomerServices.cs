using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ICustomerServices
    {
        Task<CustomerRequestDto> AddCustomer(CustomerRequestDto customerRequestDto);

        Task<IEnumerable<CustomerResponseDto>> GetAllCustomer();

        Task<string> EditCustomer(int PartyId, CustomerRequestDto customerRequestDto);

        Task<string> DeleteCustomer(int PartyId);

        Task<GstKycDetailsDto> GetGstKycDetails(GstKycDetailsRequestDto requestDto);

        Task<PanKycDetailModel> GetPanKycDetails(PanKycDetailRequestDto requestDto);

        Task<IEnumerable<comMstCityDto>> GetAllCity();
    }
}

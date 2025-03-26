using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using static RFQ.UI.Domain.Model.CustomerViewModel;

namespace RFQ.UI.Application.Inteface
{
    public interface ICustomerServices
    {
        Task<string> AddCustomer(CustomerViewModelDto customerViewModelDto);

        Task<IEnumerable<CustomerViewModelDto>> GetAllCustomer();

        Task<string> EditCustomer(int PartyId, CustomerViewModelDto customerViewModelDto);

        Task<string> DeleteCustomer(int PartyId);

        Task<GstKycDetailsDto> GetGstKycDetails(GstKycDetailsRequestDto requestDto);

        Task<PanKycDetailModel> GetPanKycDetails(PanKycDetailRequestDto requestDto);
    }
}

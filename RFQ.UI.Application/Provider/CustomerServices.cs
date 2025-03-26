using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;
namespace RFQ.UI.Application.Provider
{
    public class CustomerServices : ICustomerServices
    {
        private readonly CustomerAdaptor _customerAdaptor;

        public CustomerServices(CustomerAdaptor customerAdaptor)
        {
            _customerAdaptor = customerAdaptor;
        }

        public Task<string> AddCustomer(CustomerRequestDto customerViewModelDto)
        {
            return _customerAdaptor.AddCustomer(customerViewModelDto);
        }

        public Task<string> DeleteCustomer(int PartyId)
        {
            return _customerAdaptor.DeleteCustomer(PartyId);
        }

        public Task<string> EditCustomer(int PartyId, CustomerRequestDto customerViewModelDto)
        {
            return _customerAdaptor.EditCustomer(PartyId, customerViewModelDto);
        }

        public Task<IEnumerable<CustomerResponseDto>> GetAllCustomer()
        {
            return _customerAdaptor.GetAllCustomer();
        }

        public async Task<GstKycDetailsDto> GetGstKycDetails()
        {
            return await _customerAdaptor.GetGstKycDetails();
        }
        public async Task<PanKycDetailModel> GetPanKycDetails()
        {
            return await _customerAdaptor.GetPanKycDetails();
        }
    }
}

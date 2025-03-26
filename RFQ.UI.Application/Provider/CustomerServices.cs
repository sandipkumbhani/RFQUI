using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;
using static RFQ.UI.Domain.Model.CustomerViewModel;
namespace RFQ.UI.Application.Provider
{
    public class CustomerServices : ICustomerServices
    {
        private readonly CustomerAdaptor _customerAdaptor;

        public CustomerServices(CustomerAdaptor customerAdaptor)
        {
            _customerAdaptor = customerAdaptor;
        }

        public Task<string> AddCustomer(CustomerViewModelDto customerViewModelDto)
        {
            return _customerAdaptor.AddCustomer(customerViewModelDto);
        }

        public Task<string> DeleteCustomer(int PartyId)
        {
            return _customerAdaptor.DeleteCustomer(PartyId);
        }

        public Task<string> EditCustomer(int PartyId, CustomerViewModelDto customerViewModelDto)
        {
            return _customerAdaptor.EditCustomer(PartyId, customerViewModelDto);
        }

        public Task<IEnumerable<CustomerViewModelDto>> GetAllCustomer()
        {
            return _customerAdaptor.GetAllCustomer();
        }

        public async Task<GstKycDetailsDto> GetGstKycDetails(GstKycDetailsRequestDto requestDto)
        {
            return await _customerAdaptor.GetGstKycDetails(requestDto);
        }
        public async Task<PanKycDetailModel> GetPanKycDetails(PanKycDetailRequestDto requestDto)
        {
            return await _customerAdaptor.GetPanKycDetails(requestDto);
        }
    }
}

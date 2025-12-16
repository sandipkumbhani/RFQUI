using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
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

        public Task<NewCommonResponseDto> AddCustomer(CustomerRequestDto customerRequestDto)
        {
            return _customerAdaptor.AddCustomer(customerRequestDto);
        }

        public Task<string> DeleteCustomer(int PartyId)
        {
            return _customerAdaptor.DeleteCustomer(PartyId);
        }

        public Task<string> EditCustomer(int PartyId, CustomerRequestDto customerRequestDto)
        {
            return _customerAdaptor.EditCustomer(PartyId, customerRequestDto);
        }

        public Task<PageList<CustomerResponseDto>> GetAllCustomer(PagingParam pagingParam)
        {
            return _customerAdaptor.GetAllCustomer(pagingParam);
        }

        public async Task<GstKycDetailsDto> GetGstKycDetails(GstKycDetailsRequestDto gstKycDetailsRequestDto)
        {
            return await _customerAdaptor.GetGstKycDetails(gstKycDetailsRequestDto);
        }
        public async Task<PanKycDetailModel> GetPanKycDetails(PanKycDetailRequestDto panKycDetailRequestDto)
        {
            return await _customerAdaptor.GetPanKycDetails(panKycDetailRequestDto);
        }

        public async Task<IEnumerable<ComMstCityDto>> GetAllCity()
        {
            return await _customerAdaptor.GetAllCity();
        }
        public async Task<IEnumerable<CustomerRequestDto>> GetDrpCustomerList(int companyId)
        {
            return await _customerAdaptor.GetDrpCustomerList(companyId);
        }
        public async Task<string?> GetAutoCustomerCode(int UserId)
        {
            return await _customerAdaptor.GetAutoCustomerCode(UserId);
        }
    }
}

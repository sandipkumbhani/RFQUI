using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class CompanyStateService : ICompanyStateService
    {
        private readonly CompanyStateAdaptor _companyStateAdaptor;
        public CompanyStateService(CompanyStateAdaptor companyStateAdaptor)
        {
            _companyStateAdaptor = companyStateAdaptor;
        }
        public Task<List<CompanyStateResponseDto>> GetAllStateList()
        {
            return _companyStateAdaptor.GetAllStateList();
        }
    }
}

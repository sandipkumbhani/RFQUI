using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Infrastructure.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class FranchiseService : IFranchiseService
    {
        private readonly FranchiseAdaptor _franchiseAdaptor;
        public FranchiseService(FranchiseAdaptor franchiseAdaptor)
        {
            _franchiseAdaptor = franchiseAdaptor;
        }
        public Task<string> AddFranchise(FranchiseViewModel.FranchiseViewModelDto franchiseViewModelDto)
        {
            return _franchiseAdaptor.AddFranchise(franchiseViewModelDto);
        }

        public Task<string> DeleteFranchise(int companyId)
        {
            return _franchiseAdaptor.DeleteFranchise(companyId);
        }

        public Task<string> EditFranchise(int companyId, FranchiseViewModel.FranchiseViewModelDto franchiseViewModelDto)
        {
            return _franchiseAdaptor.EditFranchise(companyId, franchiseViewModelDto);
        }

        public Task<IEnumerable<FranchiseViewModel.FranchiseViewModelDto>> GetFranchiseAll()
        {
            return _franchiseAdaptor.GetFranchiseAll();
        }
    }
}

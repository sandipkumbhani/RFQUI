using RFQ.UI.Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static RFQ.UI.Domain.Model.FranchiseViewModel;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IFranchiseAdaptor
    {
        Task<string> AddFranchise(FranchiseViewModelDto franchiseViewModelDto);
        Task<IEnumerable<FranchiseViewModelDto>> GetFranchiseAll();
        Task<string> EditFranchise(int companyId, FranchiseViewModelDto franchiseViewModelDto);
        Task<string> DeleteFranchise(int companyId);
    }

}

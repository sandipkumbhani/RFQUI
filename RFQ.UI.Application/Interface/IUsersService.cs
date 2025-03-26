using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Domain.Model;
using static RFQ.UI.Domain.Model.GetCompanyAndFranchiseModel;
using static RFQ.UI.Domain.Model.UserViewModel;

namespace RFQ.UI.Application.Interface
{
    public interface IUsersService
    {
        Task<string> GetUsers(int userId);
        Task<IEnumerable<UserViewModelDto>> GetAllUser();
        Task<string> AddUsers(UserViewModelDto userViewModelDto);
        Task<string> EditUsers(int UserId, UserViewModelDto userViewModelDto);
        Task<string> DeleteUsers(int UserId);
        public Task<IEnumerable<GetCompanyAndFranchiseModelDto>> GetAllCompanyAndFranchise();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Domain.Model;
using RFQ.UI.Infrastructure.Provider;
using static RFQ.UI.Domain.Model.DashboardViewModel;
using static RFQ.UI.Domain.Model.GetCompanyAndFranchiseModel;
using static RFQ.UI.Domain.Model.UserViewModel;

namespace RFQ.UI.Application.Provider
{
    public class UsersService : IUsersService
    {
        private readonly UsersAdaptor _usersAdaptor;

        public UsersService(UsersAdaptor usersAdaptor)
        {
            _usersAdaptor = usersAdaptor;
        }
        public Task<string> AddUsers(UserViewModelDto userViewModelDto)
        {
            return _usersAdaptor.AddUsers(userViewModelDto);
        }

        public Task<string> DeleteUsers(int UserId)
        {
            return _usersAdaptor.DeleteUsers(UserId);
        }

        public Task<string> EditUsers(int UserId, UserViewModelDto userViewModelDto)
        {
            return _usersAdaptor.EditUsers(UserId, userViewModelDto);
        }

        public Task<IEnumerable<UserViewModelDto>> GetAllUser()
        {
            return _usersAdaptor.GetAllUser();
        }

        public Task<string> GetUsers(int userId)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<GetCompanyAndFranchiseModelDto>> GetAllCompanyAndFranchise()
        {
            return await _usersAdaptor.GetAllCompanyAndFranchise();
        }
    }
}

using RFQ.UI.Application.Interface;
using RFQ.UI.Infrastructure.Provider;
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
    }
}

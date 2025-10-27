using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class UsersService : IUsersService
    {
        private readonly UsersAdaptor _usersAdaptor;
        public UsersService(UsersAdaptor usersAdaptor)
        {
            _usersAdaptor = usersAdaptor;
        }
        public Task<string> AddUsers(UserRequestDto userRequestDto)
        {
            return _usersAdaptor.AddUsers(userRequestDto);
        }
        public Task<string> DeleteUsers(int userId)
        {
            return _usersAdaptor.DeleteUsers(userId);
        }
        public Task<string> EditUsers(int userId, UserRequestDto userRequestDto)
        {
            return _usersAdaptor.EditUsers(userId, userRequestDto);
        }

        public Task<PageList<UserResponseDto>> GetAllUser(PagingParam pagingParam)
        {
            return _usersAdaptor.GetAllUser(pagingParam);
        }
        public Task<UserResponseDto> GetUserById(int userId)
        {
            return _usersAdaptor.GetUserById(userId);
        }
        public async Task<IEnumerable<CompanyAndFranchiseListDto>> GetAllCompanyAndFranchise()
        {
            return await _usersAdaptor.GetAllCompanyAndFranchise();
        }
        public async Task<IEnumerable<LocationListDto>> GetAllLocation()
        {
            return await _usersAdaptor.GetAllLocation();
        }
        public async Task<bool> UpdateUserPassword(UserRequestDto userRequestDto)
        {
            return await _usersAdaptor.UpdateUsersPassword(userRequestDto);
        }

        public async Task<UserResponseDto> GetByLoginIdAsync(string loginId)
        {
            return await _usersAdaptor.GetByLoginIdAsync(loginId);
        }
    }
}

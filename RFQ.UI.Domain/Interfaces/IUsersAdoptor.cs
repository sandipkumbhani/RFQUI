using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IUsersAdoptor
    {
        Task<UserResponseDto> GetUserById(int userId);
        Task<PageList<UserResponseDto>?> GetAllUser(PagingParam pagingParam);
        Task<string> AddUsers(UserRequestDto userRequestDto);
        Task<string> EditUsers(int userId, UserRequestDto userRequestDto);
        Task<string> DeleteUsers(int userId);
        Task<IEnumerable<CompanyAndFranchiseListDto>> GetAllCompanyAndFranchise();
        Task<IEnumerable<LocationListDto>> GetAllLocation();
        Task<bool> UpdateUsersPassword(UserRequestDto userRequestDto);

    }
}

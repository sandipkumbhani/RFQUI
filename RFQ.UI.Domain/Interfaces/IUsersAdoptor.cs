using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IUsersAdoptor
    {
        Task<string> GetUsers(int userId);
        Task<PageList<UserResponseDto>?> GetAllUser(PagingParam pagingParam);
        Task<string> AddUsers(UserRequestDto userRequestDto);
        Task<string> EditUsers(int UserId, UserRequestDto userRequestDto);
        Task<string> DeleteUsers(int UserId);
        Task<IEnumerable<CompanyAndFranchiseListDto>> GetAllCompanyAndFranchise();
        Task<IEnumerable<LocationListDto>> GetAllLocation();

    }
}

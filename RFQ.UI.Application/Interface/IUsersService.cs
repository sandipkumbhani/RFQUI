using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IUsersService
    {
        Task<string> GetUsers(int userId);
        Task<IEnumerable<UserResponseDto>> GetAllUser();
        Task<string> AddUsers(UserRequestDto userRequestDto);
        Task<string> EditUsers(int UserId, UserRequestDto userRequestDto);
        Task<string> DeleteUsers(int UserId);
        Task<IEnumerable<CompanyAndFranchiseListDto>> GetAllCompanyAndFranchise();
        //Task<IEnumerable<LocationListDto>> GetAllLocation();
    }
}

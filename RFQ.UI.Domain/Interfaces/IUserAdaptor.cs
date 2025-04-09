using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IUserAdaptor
    {
        Task<IEnumerable<CompanyUserResponseDto>> GetAllUsers();
    }
}

using RFQ.UI.Domain.Model;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IUserAdaptor
    {
        Task<IEnumerable<CompanyUserDto>> GetAllUsers();
    }
}

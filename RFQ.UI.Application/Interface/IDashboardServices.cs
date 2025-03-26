using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Interface
{
    public interface IDashboardServices
    {
        Task<IEnumerable<CompanyUserDto>> GetAllUsers();
    }
}

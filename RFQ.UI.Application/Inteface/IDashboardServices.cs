using RFQ.UI.Domain.Model;

namespace RFQ.UI.Application.Inteface
{
    public interface IDashboardServices
    {
        Task<IEnumerable<CompanyUserDto>> GetAllUsers();
    }
}
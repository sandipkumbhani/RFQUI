using RFQ.UI.Models;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ILoginAdaptor
    {
        Task<string> PostApiDataAsync(LoginDto loginDto);
    }
}

using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface ILocationAdaptor
    {
        Task<IEnumerable<LocationResponseDto>> GetAllLocation();
        Task<string> AddLocation(LocationRequestDto locationRequestDto);
        Task<string> EditLocation(int LocationId, LocationRequestDto locationRequestDto);
        Task<string> DeleteLocation(int LocationId);
    }
}

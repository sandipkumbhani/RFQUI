using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ILocationService
    {
        Task<PageList<LocationResponseDto>> GetAllLocation(PagingParam pagingParam);
        Task<bool> AddLocation(LocationRequestDto locationRequestDto);
        Task<bool> EditLocation(int LocationId, LocationRequestDto locationRequestDto);
        Task<string> DeleteLocation(int LocationId);
        Task<IEnumerable<LocationResponseDto>> GetAllLocationList(int companyId);
        Task<LocationResponseDto> GetLocationById(int locationId);
    }
}

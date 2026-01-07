using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class LocationService : ILocationService
    {
        private readonly LocationAdaptor _locationAdaptor;
        public LocationService(LocationAdaptor locationAdaptor)
        {
            _locationAdaptor = locationAdaptor;
        }
        public async Task<bool> AddLocation(LocationRequestDto locationRequestDto)
        {
            return await _locationAdaptor.AddLocation(locationRequestDto);
        }
        public Task<string> DeleteLocation(int LocationId)
        {
            return _locationAdaptor.DeleteLocation(LocationId);
        }
        public Task<bool> EditLocation(int LocationId, LocationRequestDto locationRequestDto)
        {
            return _locationAdaptor.EditLocation(LocationId, locationRequestDto);
        }
        public Task<PageList<LocationResponseDto>> GetAllLocation(PagingParam pagingParam)
        {
            return _locationAdaptor.GetAllLocation(pagingParam);
        }
        public Task<IEnumerable<LocationResponseDto>> GetAllLocationList(int companyId)
        {
            return _locationAdaptor.GetAllLocationList(companyId);
        }
        public Task<LocationResponseDto> GetLocationById(int locationId)
        {
            return _locationAdaptor.GetLocationById(locationId);
        }
    }
}

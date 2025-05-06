using RFQ.UI.Application.Interface;
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
        public Task<string> AddLocation(LocationRequestDto locationRequestDto)
        {
            return _locationAdaptor.AddLocation(locationRequestDto);
        }

        public Task<string> DeleteLocation(int LocationId)
        {
            return _locationAdaptor.DeleteLocation(LocationId);
        }

        public Task<string> EditLocation(int LocationId, LocationRequestDto locationRequestDto)
        {
            return _locationAdaptor.EditLocation(LocationId, locationRequestDto);
        }

        public Task<IEnumerable<LocationResponseDto>> GetAllLocation()
        {
            return _locationAdaptor.GetAllLocation();
        }
    }
}

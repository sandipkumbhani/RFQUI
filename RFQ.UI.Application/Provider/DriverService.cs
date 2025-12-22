using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using RFQ.UI.Infrastructure.Provider;

namespace RFQ.UI.Application.Provider
{
    public class DriverService : IDriverServices
    {
        private readonly DriverAdaptor _driverAdaptor;
        public DriverService(DriverAdaptor driverAdaptor)
        {
            _driverAdaptor = driverAdaptor;
        }
        public Task<DriverRequestDto> AddDriver(DriverRequestDto driverRequestDto)
        {
            return _driverAdaptor.AddDriver(driverRequestDto);
        }

        public Task<string> DeleteDriver(int DriverId)
        {
            return _driverAdaptor.DeleteDriver(DriverId);
        }

        public Task<string> EditDriver(int DriverId, DriverRequestDto driverRequestDto)
        {
            return _driverAdaptor.EditDriver(DriverId, driverRequestDto);
        }

        public Task<string> GetDriverCode(int UserId)
        {
            return _driverAdaptor.GetDriverCode(UserId);
        }

        public async Task<PageList<DriverResponseDto>> GetAllDriver(PagingParam pagingParam)
        {
            return await _driverAdaptor.GetAllDriver(pagingParam);
        }

        public Task<IEnumerable<DriverResponseDto>> GetAllDriverList()
        {
            return _driverAdaptor.GetAllDriverList();
        }

        public async Task<LicenseKycDetailsResponseDto> GetDlKycDetails(LicenseKycDetailsRequestDto licenseKycDetailsRequestDto)
        {
            return await _driverAdaptor.GetDlKycDetails(licenseKycDetailsRequestDto);
        }

        public async Task<IEnumerable<InternalMasterResponseDto>> GetDriverType()
        {
            return await _driverAdaptor.GetDriverType();
        }
    }
}

using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IDriverAdaptor
    {
        Task<DriverRequestDto> AddDriver(DriverRequestDto driverRequestDto);
        Task<PageList<DriverResponseDto>?> GetAllDriver(PagingParam pagingParam);
        Task<string> EditDriver(int DriverId, DriverRequestDto driverRequestDto);
        Task<string> DeleteDriver(int DriverId);
        Task<LicenseKycDetailsResponseDto> GetDlKycDetails(LicenseKycDetailsRequestDto licenseKycDetailsRequestDto);
        Task<IEnumerable<InternalMasterResponseDto>> GetDriverType();
        Task<IEnumerable<DriverResponseDto>> GetAllDriverList();
        Task<string> GetDriverCode(int UserId);
    }
}

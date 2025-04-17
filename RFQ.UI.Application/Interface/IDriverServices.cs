using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface IDriverServices
    {
        Task<DriverRequestDto> AddDriver(DriverRequestDto driverRequestDto);
        Task<IEnumerable<DriverResponseDto>> GetAllDriver();
        Task<string> EditDriver(int DriverId, DriverRequestDto driverRequestDto);
        Task<string> DeleteDriver(int DriverId);
        Task<LicenseKycDetailsResponseDto> GetDlKycDetails(LicenseKycDetailsRequestDto licenseKycDetailsRequestDto);
        Task<IEnumerable<InternalMasterResponseDto>> GetDriverType();
    }
}

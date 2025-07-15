using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Interface
{
    public interface IVehicleIndentService
    {
        Task<bool> AddVehicleIndent(VehicleIndentRequestDto vehicleIndentRequestDto);
        Task<string> GetIndentNo();
    }
}

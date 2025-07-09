using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleIndentAdaptor
    {
        Task<bool> AddVehicleIndent(VehicleIndentRequestDto vehicleIndentRequestDto);
    }
}

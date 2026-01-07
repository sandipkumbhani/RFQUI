using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IVehicleIndentAdaptor
    {
        Task<bool> AddVehicleIndent(VehicleIndentRequestDto vehicleIndentRequestDto);
        Task<string> GetIndentNo();
        Task<PageList<VehicleIndentResponseDto>> GetAllVehicleIndent(PagingParam pagingParam);
        Task<string> UpdateVehicleIndent(int indentId, VehicleIndentRequestDto vehicleIndentRequestDto);
        Task<bool> DeleteVehicleIndent(int indentId);
        Task<bool> IndentReferenceCheckInRfqAsync(int indentId);

    }
}

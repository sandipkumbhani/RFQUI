using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;

namespace RFQ.UI.Application.Interface
{
    public interface ILocationService
    {
        Task<IEnumerable<LocationResponseDto>> GetAllLocation();
        Task<string> AddLocation(LocationRequestDto locationRequestDto);
        Task<string> EditLocation(int LocationId, LocationRequestDto locationRequestDto);
        Task<string> DeleteLocation(int LocationId);
    }
}

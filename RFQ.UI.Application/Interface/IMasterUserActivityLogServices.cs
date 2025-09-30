using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Interface
{
    public interface IMasterUserActivityLogServices
    {
        Task<MasterUserActivityLogRequestDto?> AddMasterUserActivityLog(MasterUserActivityLogRequestDto masterUserActivityLogRequestDto);

        Task<PageList<MasterUserActivityLogResponseDto>> GetAllMasterUserActivityLogList(PagingParam pagingParam);

    }
}

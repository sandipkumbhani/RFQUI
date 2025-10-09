using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class MasterUserActivityLogServices : IMasterUserActivityLogServices
    {
        private readonly IMasterUserActivityLogAdaptor _masterUserActivityLogAdaptor;

        public MasterUserActivityLogServices(IMasterUserActivityLogAdaptor masterUserActivityLogAdaptor)
        {
            _masterUserActivityLogAdaptor = masterUserActivityLogAdaptor;
        }

        public Task<MasterUserActivityLogRequestDto?> AddMasterUserActivityLog(MasterUserActivityLogRequestDto masterUserActivityLogRequestDto)
        {
            return _masterUserActivityLogAdaptor.AddMasterUserActivityLog(masterUserActivityLogRequestDto);
        }

        public async Task<PageList<MasterUserActivityLogResponseDto>> GetAllMasterUserActivityLogList(PagingParam pagingParam)
        {
            return await _masterUserActivityLogAdaptor.GetAllMasterUserActivityLogList(pagingParam);
        }
    }
}

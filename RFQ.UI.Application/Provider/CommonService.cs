using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Infrastructure.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RFQ.UI.Application.Provider
{
    public class CommonService : ICommonService
    {
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public CommonService(CommonApiAdaptor commonApiAdaptor)
        {
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<string?> GetAutoGenerateCode(AutoGenerateCodeRequestDto requestDto)
        {
            return await _commonApiAdaptor.GetAutoGenerateCode(requestDto);
        }
    }
}

using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Provider
{
    public class RfqRecipientService : IRfqRecipientService
    {
        private readonly IRfqRecipientAdaptor _rfqRecipientAdaptor;
        public RfqRecipientService(IRfqRecipientAdaptor rfqRecipientAdaptor)
        {
            _rfqRecipientAdaptor = rfqRecipientAdaptor;
        }
        public async Task<string> AddRfqRecipient(List<RfqRecipientRequestDto> rfqRecipientRequestDtos)
        {
            return await _rfqRecipientAdaptor.AddRfqRecipient(rfqRecipientRequestDtos);
        }
        public async Task<bool> UpdateRfqRecipient(int rfqId,List<RfqRecipientRequestDto> rfqRecipientRequestDtos)
        {
            return await _rfqRecipientAdaptor.UpdateRfqRecipient(rfqId,rfqRecipientRequestDtos);
        }
    }
}

using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Domain.Interfaces
{
    public interface IRfqRecipientAdaptor
    {
        Task<string> AddRfqRecipient(List<RfqRecipientRequestDto> rfqRecipientRequestDtos);
        Task<bool> UpdateRfqRecipient(int rfqid, List<RfqRecipientRequestDto> rfqRecipientRequestDtos);
    }
}

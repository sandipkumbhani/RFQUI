using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Interface
{
    public interface IRfqRecipientService
    {
        Task<string> AddRfqRecipient(List<RfqRecipientRequestDto> rfqRecipientRequestDtos);
        Task<bool> UpdateRfqRecipient(int rfqId, List<RfqRecipientRequestDto> rfqRecipientRequestDtos);
    }
}

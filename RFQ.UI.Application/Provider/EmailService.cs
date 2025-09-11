using Microsoft.Extensions.Configuration;
using RFQ.UI.Application.Interface;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;

namespace RFQ.UI.Application.Provider
{
    public class EmailService : IEmailService
    {
        private readonly IEmailAdaptor _emailAdaptor;
        public EmailService(IEmailAdaptor emailAdaptor)
        {
                _emailAdaptor = emailAdaptor;
        }
        public async Task<bool> SendEmailAsync(EmailRequest request)
        {
            return _emailAdaptor.SendEmailAsync(request).Result;
        }
    }
}

using Microsoft.Extensions.Configuration;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.RequestDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace RFQ.UI.Infrastructure.Provider
{
    
    public class EmailAdaptor : IEmailAdaptor
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailAdaptor> _logger;

        public EmailAdaptor(IConfiguration config, ILogger<EmailAdaptor> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(EmailRequest request)
        {
            try
            {
                var smtpClient = new SmtpClient(_config["EmailSettings:SmtpServer"])
                {
                    Port = int.Parse(_config["EmailSettings:Port"]),
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(
                        _config["EmailSettings:SenderEmail"],
                        _config["EmailSettings:Password"]
                    ),
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(
                        _config["EmailSettings:SenderEmail"],
                        _config["EmailSettings:SenderName"]
                    ),
                    Subject = request.Subject,
                    Body = request.Body,
                    IsBodyHtml = request.IsHtml
                };
                mailMessage.To.Add(request.ToEmail);

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation("Mail sent successfully to {Email}", request.ToEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Mail sending failed to {Email}", request.ToEmail);
                return false;
            }
        }
    }
}

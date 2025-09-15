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

namespace RFQ.UI.Infrastructure.Provider
{
    
    public class EmailAdaptor : IEmailAdaptor
    {
        private readonly IConfiguration _config;
        public EmailAdaptor(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendEmailAsync(EmailRequest request)
        {
            try
            {
                var smtpClient = new SmtpClient(_config["EmailSettings:SmtpServer"])
                {
                    Port = int.Parse(_config["EmailSettings:Port"]),
                    Credentials = new NetworkCredential(
                        _config["EmailSettings:SenderEmail"],
                        _config["EmailSettings:Password"]
                    ),
                    EnableSsl = true,
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
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}

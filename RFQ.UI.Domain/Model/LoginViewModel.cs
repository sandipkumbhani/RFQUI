using System.ComponentModel.DataAnnotations;

namespace RFQ.UI.Models
{
    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Email Address")]
        public string EmailId { get; set; }

        [Required]
        [Display(Name = "Password")]
        public string Password { get; set; }

    }
    public class LoginDto
    {
        public string EmailId { get; set; }
        public string Password { get; set; }
    }

    public class CommanResponseDto
    {
        public int? StatusCode { get; set; }

        public object Data { get; set; }

        public string? Message { get; set; }

        public string? ErrorMessage { get; set; }

    }
}

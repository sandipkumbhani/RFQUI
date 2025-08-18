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
        public string? LoginId { get; set; }
        public string? Password { get; set; }
    }

}

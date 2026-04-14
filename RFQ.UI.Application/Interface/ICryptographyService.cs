namespace RFQ.UI.Application.Interface
{
    public interface ICryptographyService
    {
        public string Encrypt(string plainText);
        public string Decrypt(string encryptedText);
    }
}

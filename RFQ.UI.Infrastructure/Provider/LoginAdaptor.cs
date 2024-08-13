using Newtonsoft.Json;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Models;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class LoginAdaptor : ILoginAdaptor
    {
        private HttpClient _httpClient;

        public async Task<string> PostApiDataAsync(LoginViewModel loginViewModel)
        {

            try
            {
                _httpClient = new HttpClient();
                var baseUrl = "https://localhost:7272/api/Login";

                var company = JsonConvert.SerializeObject(loginViewModel);
                var requestContent = new StringContent(company, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(baseUrl, requestContent);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<CommanResponseDto>(responseData);
                if (responseModel != null)
                {
                    var responseToken = JsonConvert.DeserializeObject<ResponseToken>(responseModel?.Data.ToString()!);
                    return responseToken.Token;

                }
                return string.Empty;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
            }
            return null;
        }

        public class ResponseToken
        {
            public string? Token { get; set; }
        }



    }
}

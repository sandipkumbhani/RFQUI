using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RFQ.UI.Domain.Helper;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Domain.RequestDto;
using RFQ.UI.Domain.ResponseDto;
using System.Text;

namespace RFQ.UI.Infrastructure.Provider
{
    public class ProductAdaptor : IProductAdaptor
    {
        private HttpClient _httpClient;
        private readonly GlobalClass _globalClass;
        private readonly IConfiguration _config;
        private readonly AppSettingsGlobal _appSettings;
        private readonly CommonApiAdaptor _commonApiAdaptor;
        public ProductAdaptor(HttpClient httpClient, GlobalClass globalClass, IConfiguration configuration, AppSettingsGlobal appSettings, CommonApiAdaptor commonApiAdaptor)
        {
            _httpClient = httpClient;
            _globalClass = globalClass;
            _config = configuration;
            _appSettings = appSettings;
            _commonApiAdaptor = commonApiAdaptor;
        }
        public async Task<bool> AddProduct(ProductRequestDto productRequestDto)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.AddProduct;
                var responseModel = await _commonApiAdaptor.PostAsync<NewCommonResponseDto>(baseUrl, productRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<string> DeleteProduct(int productId)
        {
            try
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _globalClass.Token);

                var baseurl = $"{_appSettings.BaseUrl}{_config["Product:DeleteProduct"]}{productId}";
                var response = await _httpClient.DeleteAsync(baseurl);
                var responseData = await response.Content.ReadAsStringAsync();
                var responseModel = JsonConvert.DeserializeObject<NewCommonResponseDto>(responseData);
                if (responseModel != null)
                {
                    var result = responseModel.StatusCode;
                    if (result == 200)
                        return "Product Deleted";
                    else
                        return responseModel.ErrorMessage;
                }
                return "Failed to Delete Product";
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> EditProduct(int productId, ProductRequestDto productRequestDto)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.EditProduct + productId}";
                var responseModel = await _commonApiAdaptor.PutAsync<NewCommonResponseDto>(baseUrl, productRequestDto, _globalClass.Token);
                if (responseModel != null && responseModel.StatusCode == 200)
                    return true;
                return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<PageList<ProductResponseDto>?> GetAllProducts(PagingParam pagingParam)
        {
            try
            {
                var baseUrl = _appSettings.BaseUrl + _appSettings.GetAllProduct;
                var responseModel = await _commonApiAdaptor.PostAsync<CommanResponseDto>(baseUrl, pagingParam, _globalClass.Token);
                return _commonApiAdaptor.GenerateResponse<ProductResponseDto>(responseModel);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<IEnumerable<ProductResponseDto>?> GetDrpProductList(int companyId)
        {
            try
            {
                var baseUrl = $"{_appSettings.BaseUrl + _appSettings.GetDrpProductList}?companyId={companyId}";
                var responseModel = await _commonApiAdaptor.GetAsync<NewCommonResponseDto>(baseUrl, _globalClass.Token);
                if (responseModel != null)
                {
                    var list = JsonConvert.DeserializeObject<List<ProductResponseDto>>(Convert.ToString(responseModel.Data!));
                    return list;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

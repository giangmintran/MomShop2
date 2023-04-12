using Microsoft.AspNetCore.Mvc;
using MOMShop.Dto.Product;
using MOMShop.Dto.ProductDetail;
using MOMShop.Entites;
using MOMShop.Services.Interfaces;
using MOMShop.Utils;
using System;
using System.Collections.Generic;

namespace MOMShop.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : BaseController
    {
        private IProductServices _services;
        public ProductController(IProductServices services)
        {
            _services = services;
        }

        [HttpGet("find-all")]
        public APIResponse GetProducts([FromQuery] FilterProductDto input)
        {
            try
            {
                var result = _services.GetProducts(input);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpPost("add")]
        public APIResponse AddProducts([FromBody] UpdateProductDto input)
        {
            try
            {
                var result = _services.AddProducts(input);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpPost("add-detail")]
        public APIResponse AddProductDetails([FromBody] ProductDetailDto input)
        {
            try
            {
                var result = _services.AddProductDetail(input);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpPut("update")]
        public APIResponse UpdateProducts([FromBody] UpdateProductDto input)
        {
            try
            {
                var result = _services.UpdateProducts(input);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpPut("update-detail")]
        public APIResponse UpdateProductDetails([FromBody] ProductDetailDto input)
        {
            try
            {
                var result = _services.UpdateProductDetail(input);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpDelete("delete/{id}")]
        public APIResponse DeleteProduct(int id)
        {
            try
            {
                _services.DeleteProducts(id);
                return new APIResponse(null, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpDelete("delete-detail/{id}")]
        public APIResponse DeleteProducDetailt(int id)
        {
            try
            {
                _services.DeleteProductDetail(id);
                return new APIResponse(null, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }


        [HttpGet("find-by-id/{id}")]
        public APIResponse FindById(int id)
        {
            try
            {
                var result = _services.FindById(id);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpGet("product-detail/{id}")]
        public APIResponse FindDetailById(int id)
        {
            try
            {
                var result = _services.FindDetailById(id);
                return new APIResponse(result, 200, "OK", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }
    }
}

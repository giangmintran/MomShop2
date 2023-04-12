using MOMShop.Dto.Product;
using MOMShop.Dto.ProductDetail;
using MOMShop.Entites;
using MOMShop.Utils;
using System.Collections.Generic;

namespace MOMShop.Services.Interfaces
{
    public interface IProductServices
    {
        Paging<ProductDto> GetProducts(FilterProductDto input);
        Product AddProducts(UpdateProductDto input);
        ProductDto FindById(int id);
        Product UpdateProducts(UpdateProductDto input);
        void DeleteProducts(int id);
        void ChangeStatus(int id);

        //ProductDetail

        ProductDetailDto AddProductDetail(ProductDetailDto input);
        ProductDetailDto UpdateProductDetail(ProductDetailDto input);
        ProductDetailDto FindDetailById(int id);
        void DeleteProductDetail(int id);

    }
}

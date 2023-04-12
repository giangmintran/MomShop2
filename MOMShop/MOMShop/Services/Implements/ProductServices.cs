using AutoMapper;
using MOMShop.Dto.Product;
using MOMShop.Dto.ProductDetail;
using MOMShop.Entites;
using MOMShop.MomShopDbContext;
using MOMShop.Services.Interfaces;
using MOMShop.Utils;
using MOMShop.Utils.ConstantVariables.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;

namespace MOMShop.Services.Implements
{
    public class ProductServices : IProductServices
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public ProductServices(ApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;

        }

        public Product AddProducts(UpdateProductDto input)
        {
            var productCode = input.Name.ToLower();
            productCode = RemoveAccents.RemoveAccent(productCode).Replace(" ", "-").Trim();
            var productFind = _dbContext.Products.FirstOrDefault(e => e.Code == productCode && !e.Deleted);
            if (productFind != null)
            {
                throw new FaultException(new FaultReason("Mã sản phẩm đã tồn tại"), new FaultCode((1500).ToString()), "");
            }

            var insert = _mapper.Map<Product>(input);
            insert.Code = productCode;
            var result = _dbContext.Products.Add(insert);
            _dbContext.SaveChanges();
            return result.Entity;
        }

        public Product UpdateProducts(UpdateProductDto input)
        {
            var product = _dbContext.Products.FirstOrDefault(e => e.Id == input.Id && !e.Deleted);
            if(product == null)
            {
                throw new FaultException(new FaultReason("Không tìm thấy sản phẩm"), new FaultCode((1500).ToString()), "");
            }
            var productCode = input.Name.ToLower();
            productCode = RemoveAccents.RemoveAccent(productCode).Replace(" ", "-").Trim();

            //var productFind = _dbContext.Products.Where(e => e.Code == productCode && !e.Deleted);
            //if (productFind.Count() == 2)
            //{
            //    throw new FaultException(new FaultReason("Mã sản phẩm đã tồn tại"), new FaultCode((1500).ToString()), "");
            //}

            product.Code = productCode;
            product.Name = input.Name;
            product.Price = input.Price;
            product.Status = input.Status;
            product.Description = input.Description;
            product.ProductType = input.ProductType;
            _dbContext.SaveChanges();
            return product;
        }

        public void DeleteProducts(int id)
        {
            var product = _dbContext.Products.FirstOrDefault(e => e.Id == id && !e.Deleted);
            if (product == null)
            {
                throw new System.Exception("Không tìm thấy sản phẩm");
            }
            product.Deleted = true;
            _dbContext.SaveChanges();

        }

        public ProductDto FindById(int id)
        {
            var product = _dbContext.Products.FirstOrDefault(e => e.Id == id && !e.Deleted);
            var productDetail = _dbContext.ProductDetails.Where(e => e.ProductId == id).ToList();
            if (product == null)
            {
                throw new FaultException(new FaultReason("Không tìm thấy sản phẩm"), new FaultCode((1500).ToString()), "");
            }

            var result = new ProductDto();
            result = _mapper.Map<ProductDto>(product);
            result.ProductDetails = _mapper.Map<List<ProductDetailDto>>(productDetail);
            return result;
        }

        public Paging<ProductDto> GetProducts(FilterProductDto input)
        {
            var result = new Paging<ProductDto>();
            result.Items = new List<ProductDto>();

            var products = _dbContext.Products.Where(e => !e.Deleted && (input.Status == null || e.Status == input.Status) && (input.Keyword == null || e.Name.Contains(input.Keyword) || e.Code.Contains(input.Keyword))).ToList();

            foreach ( var product in products)
            {
                var item = _mapper.Map<ProductDto>(product);
                //item.ProductType = product.ProductType switch
                //{
                //    ProductType.AO_THUN => ProductTypeString.AO_THUN,
                //    ProductType.AO_SO_MI => ProductTypeString.SO_MI,
                //    ProductType.AO_KHOAC => ProductTypeString.AO_KHOAC,
                //    ProductType.QUAN => ProductTypeString.QUAN,
                //    ProductType.PHU_KIEN => ProductTypeString.PHU_KIEN,
                //};
                result.Items.Add(item);
            }
            result.TotalItems = result.Items.Count;

            result.Items = result.Items.Skip(input.Skip).Take(input.PageSize).ToList();
            return result;
        }

        public void ChangeStatus(int id)
        {
            var product = _dbContext.Products.FirstOrDefault(e => e.Id == id);
            var productDetail = _dbContext.ProductDetails.Where(e => e.ProductId == id ).ToList();
            if (product == null)
            {
                throw new FaultException(new FaultReason("Không tìm thấy sản phẩm"), new FaultCode((1500).ToString()), "");
            }
            product.Status = 3;
            _dbContext.SaveChanges();
        }

        public ProductDetailDto AddProductDetail(ProductDetailDto input)
        {
            var insert = _mapper.Map<ProductDetail>(input);
            _dbContext.Add(insert);
            _dbContext.SaveChanges();
            return input;
        }

        public ProductDetailDto UpdateProductDetail(ProductDetailDto input)
        {
            var productDetail = _dbContext.ProductDetails.FirstOrDefault(e => e.Id == input.Id);
            if (productDetail == null)
            {
                throw new FaultException(new FaultReason("Không tìm thấy chi tiết sản phẩm"), new FaultCode((1500).ToString()), "");
            }
            productDetail.Size = input.Size;
            productDetail.Quantity = input.Quantity;
            productDetail.Description = input.Description;
            _dbContext.SaveChanges();
            return input;
        }

        public void DeleteProductDetail(int id)
        {
            var productDetail = _dbContext.ProductDetails.FirstOrDefault(e => e.Id == id);
            if (productDetail == null)
            {
                throw new FaultException(new FaultReason("Không tìm thấy chi tiết sản phẩm"), new FaultCode((1500).ToString()), "");
            }
            _dbContext.ProductDetails.Remove(productDetail);
            _dbContext.SaveChanges();
        }

        public ProductDetailDto FindDetailById(int id)
        {
            var productDetail = _dbContext.ProductDetails.FirstOrDefault(e => e.Id == id);
            if (productDetail == null)
            {
                throw new FaultException(new FaultReason("Không tìm thấy chi tiết sản phẩm"), new FaultCode((1500).ToString()), "");
            }
            return _mapper.Map<ProductDetailDto>(productDetail);
        }
    }
}

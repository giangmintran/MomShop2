using AutoMapper;
using MOMShop.Dto.Product;
using MOMShop.Dto.ProductDetail;
using MOMShop.Dto.Users;
using MOMShop.Entites;

namespace MOMShop.MomShopMapperProfile
{
    public class MapperProfile : Profile
    {
        public MapperProfile() 
        {
            CreateMap<CreateProductDto, Product>().ReverseMap();
            CreateMap<UpdateProductDto, Product>().ReverseMap();
            CreateMap<ProductDto, Product>().ReverseMap();
            CreateMap<UsersDto, Users>().ReverseMap();
            CreateMap<ProductDetailDto, ProductDetail>().ReverseMap();
        }
    }
}

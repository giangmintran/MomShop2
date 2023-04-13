using MOMShop.Dto.Product;
using MOMShop.Dto.ReceivedOrder;
using MOMShop.Entites;
using MOMShop.Utils;

namespace MOMShop.Services.Interfaces
{
    public interface IReceiveOrderServices
    {
        Paging<ReceiveOrderDto> GetReceiveOrders(FilterReceiveOrderDto input);
        ReceiveOrderDto AddReceiveOrder(CreateReceiveOrderDto input);
        ReceiveOrderDto FindById(int id);
        ReceiveOrderDto UpdateReceiveOrder(UpdateReceiveOrderDto input);
        void DeleteReceiveOrder(int id);
    }
}

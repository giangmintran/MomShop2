using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MOMShop.Dto.Product;
using MOMShop.Dto.ReceivedOrder;
using MOMShop.Entites;
using MOMShop.MomShopDbContext;
using MOMShop.Services.Interfaces;
using MOMShop.Utils;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;

namespace MOMShop.Services.Implements
{
    public class ReceiverOrderServices : IReceiveOrderServices
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public ReceiverOrderServices(ApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;

        }
        public ReceiveOrderDto AddReceiveOrder(CreateReceiveOrderDto input)
        {
            var receiveOrder = _dbContext.ReceiveOrders.FirstOrDefault(e => e.Code == input.Code && !e.Deleted);
            if (receiveOrder != null)
            {
                throw new FaultException(new FaultReason("Mã hóa đơn đã tồn tại"), new FaultCode((1500).ToString()), "");
            }

            var insert = _mapper.Map<ReceiveOrder>(input);
            var result = _dbContext.ReceiveOrders.Add(insert);
            _dbContext.SaveChanges();
            return _mapper.Map<ReceiveOrderDto>( result.Entity);
        }

        public void DeleteReceiveOrder(int id)
        {
            var receiveOrder = _dbContext.ReceiveOrders.FirstOrDefault(e => e.Id == id && !e.Deleted);
            if (receiveOrder != null)
            {
                throw new FaultException(new FaultReason("Hóa đơn đã tồn tại"), new FaultCode((1500).ToString()), "");
            }
            receiveOrder.Deleted = true;
            _dbContext.SaveChanges();
        }

        public ReceiveOrderDto FindById(int id)
        {
            var receiveOrder = _dbContext.ReceiveOrders.FirstOrDefault(e => e.Id == id && !e.Deleted);
            return _mapper.Map<ReceiveOrderDto>(receiveOrder);
        }

        public Paging<ReceiveOrderDto> GetReceiveOrders(FilterReceiveOrderDto input)
        {
            var result = new Paging<ReceiveOrderDto>();
            result.Items = new List<ReceiveOrderDto>();

            var receiveOrders = _dbContext.ReceiveOrders.Where(e => !e.Deleted && (input.Status == null || e.Status == input.Status) && (input.Keyword == null || e.Supplier.Contains(input.Keyword) || e.Receiver.Contains(input.Keyword))).ToList();

            foreach (var order in receiveOrders)
            {
                var item = _mapper.Map<ReceiveOrderDto>(order);
                result.Items.Add(item);
            }
            result.TotalItems = result.Items.Count;

            result.Items = result.Items.Skip(input.Skip).Take(input.PageSize).ToList();
            return result;
        }

        public ReceiveOrderDto UpdateReceiveOrder(UpdateReceiveOrderDto input)
        {
            var receiveOrder = _dbContext.ReceiveOrders.FirstOrDefault(e => e.Id == input.Id && !e.Deleted);
            if (receiveOrder != null)
            {
                throw new FaultException(new FaultReason("Hóa đơn đã tồn tại"), new FaultCode((1500).ToString()), "");
            }

            receiveOrder.Code = input.Code;
            receiveOrder.CreatedDate = input.CreatedDate;
            receiveOrder.ReceivedDate = input.ReceivedDate;
            receiveOrder.Supplier = input.Supplier;
            receiveOrder.Receiver = input.Receiver;
            _dbContext.SaveChanges();
            return _mapper.Map<ReceiveOrderDto>(receiveOrder);
        }
    }
}

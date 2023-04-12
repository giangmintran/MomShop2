using MOMShop.Entites;
using MOMShop.Services.Interfaces;

namespace MOMShop.Services.Implements
{
    public class UserServices : IUserServices
    {
        public User Login()
        {
            var user = new User() 
            { 
                Id = 1,
                Type = 2,
            };
            return user;
        }
        
    }
}

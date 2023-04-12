using Microsoft.AspNetCore.Mvc;
using MOMShop.Domain.Interfaces;
using MOMShop.Dto.Product;
using MOMShop.Dto.Users;
using MOMShop.Entites;
using MOMShop.Services.Implements;
using MOMShop.Services.Interfaces;
using System;

namespace MOMShop.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUsersServices _usersServices;

        public UserController(IUsersServices userServices)
        {
            _usersServices = userServices;
        }
        [HttpPost("login")]
        public LoginResultDto Login([FromBody] LoginDto input)
        {
            try
            {
                var result = _usersServices.Login(input);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}

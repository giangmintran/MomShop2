using System;

namespace MOMShop.Utils.Exceptions
{
    public class UserFriendlyException : Exception
    {
        public UserFriendlyException(string message) : base(message)
        {

        }
    }
}

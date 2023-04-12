using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MOMShop.Utils.Exceptions;
using System;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;

namespace MOMShop.Utils
{
    public class BaseController : ControllerBase
    {
        protected IActionResult ReturnException(Exception ex)
        {
            if (ex is UserFriendlyException) // exception có phải là UserFriendlyException 
            {
                var userEx = ex as UserFriendlyException; // ép kiểu sang
                return StatusCode(StatusCodes.Status400BadRequest, new ExceptionBody
                {
                    Message = userEx.Message
                });
            }
            //_logger.LogError(ex, ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new ExceptionBody
            {
                Message = ex.Message
            });
        }
        /// <summary>
        /// Get ra GetType() của Exception để bắt Message của Exception chuẩn nhất để xem
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        [NonAction]
        public APIResponse OkException(Exception ex)
        {
            var request = Request;
            string errStr = $"Path = {request.Path}, Query = {JsonSerializer.Serialize(request.Query)}, ";
            var claims = HttpContext.User.Identity != null ? HttpContext.User.Identity as ClaimsIdentity : null;
            if (claims != null)
            {
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                errStr += $"userId = {userId}, ";
            }

            var httpRequestEx = ex as HttpRequestException;
            if (httpRequestEx != null)
            {
                return new APIResponse(httpRequestEx.Message, (int)ErrorCode.HttpRequestException, httpRequestEx.Message, 1);
            }

            return new APIResponse(null, (int)ErrorCode.InternalServerError, ex.Message, 1);
        }
    }
}

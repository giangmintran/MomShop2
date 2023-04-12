using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MOMShop.Utils;
using MOMShop.Utils.Exceptions;
using System;
using System.IO;
using System.Net.Http;
using System.Security.Claims;
using System.ServiceModel;
using System.Text.Json;

namespace MOMShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        public BaseController()
        {
        }

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
            return StatusCode(StatusCodes.Status500InternalServerError, new ExceptionBody
            {
                Message = ex.Message
            });
        }

        [NonAction]
        public APIResponse OkException(Exception ex)
        {
            var request = Request;
            string errStr = $"Path = {request.Path}, Query = {JsonSerializer.Serialize(request.Query)}, ";
            var claims = HttpContext.User.Identity != null ? HttpContext.User.Identity as ClaimsIdentity : null;

            var fex = ex as FaultException;
            if (fex != null)
            {
                return new APIResponse(null, int.Parse(fex.Code.Name), fex.Message,1);
            }

            var httpRequestEx = ex as HttpRequestException;
            if (httpRequestEx != null)
            {
                //throw new Exception( $"{ex.GetType()}: {errStr}, Message = {ex.Message}");
                return new APIResponse(null, (int)ErrorCode.HttpRequestException, httpRequestEx.Message,1);
            }

            //_logger?.LogInformation(ex, $"{ex.GetType()}: {errStr}, Message = {ex.Message}");
            return new APIResponse(null, (int)ErrorCode.InternalServerError, ex.Message, 1);
        }

        //[NonAction]
        //protected FileContentResult FileByFormat(byte[] fileByte, string fileName)
        //{
        //    string ext = Path.GetExtension(fileName)?.ToLower();

        //    return ext switch
        //    {
        //        ".jpg" or ".jpeg" or ".jfif" => File(fileByte, MimeTypeNames.ImageJpeg),
        //        ".png" => File(fileByte, MimeTypeNames.ImagePng),
        //        ".svg" => File(fileByte, MimeTypeNames.ImageSvgXml),
        //        ".gif" => File(fileByte, MimeTypeNames.ImageGif),
        //        ".mp4" => File(fileByte, MimeTypeNames.VideoMp4),
        //        //".pdf" => File(fileByte, MimeTypeNames.ApplicationPdf);
        //        _ => File(fileByte, MimeTypeNames.ApplicationOctetStream, fileName),
        //    };
        //}
    }
}

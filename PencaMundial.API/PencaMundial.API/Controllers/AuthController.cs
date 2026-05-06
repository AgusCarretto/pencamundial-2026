using Microsoft.AspNetCore.Identity; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PencaMundial.API.Data;
using PencaMundial.API.DTOs;
using PencaMundial.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PencaMundial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserResponseDto>> Login(UserLoginDto dto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == dto.UserName);

            if (user == null)
            {
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            // Verificamos la contraseña con la herramienta nativa
            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (result != PasswordVerificationResult.Success)
            {
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            // FABRICAMOS EL TOKEN (La pulsera VIP)
            var tokenHandler = new JwtSecurityTokenHandler();
            // OJO ACÁ: asegurate de inyectar IConfiguration en el constructor del AuthController para poder leer la clave del appsettings
            var key = Encoding.UTF8.GetBytes("PencaMundialSecreta2026SuperLargaYSeguraParaQueNoFalle");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName)
                }),
                Expires = DateTime.UtcNow.AddDays(7), // El token dura 7 días
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);



            return Ok(new
            {
                Id = user.Id,
                UserName = user.UserName,
                TotalPoints = user.TotalPoints,
                Token = tokenString
            });
        }
    }
}
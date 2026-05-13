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

            // --- ACÁ ESTÁ EL CAMBIO ---
            // Verificamos la contraseña encriptando lo que llega con la MISMA llave del registro
            var key = Encoding.UTF8.GetBytes("PencaMundialSecreta2026SuperLargaYSeguraParaQueNoFalle");
            string incomingHash;

            using (var hmac = new System.Security.Cryptography.HMACSHA256(key))
            {
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
                incomingHash = Convert.ToBase64String(hashBytes);
            }

            // Si el hash nuevo no coincide con el guardado en la base de datos... rebote.
            if (user.PasswordHash != incomingHash)
            {
                return Unauthorized("Usuario o contraseña incorrectos.");
            }
            // ---------------------------

            // FABRICAMOS EL TOKEN (La pulsera VIP)
            var tokenHandler = new JwtSecurityTokenHandler();
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



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            // 1. Validar que el nombre de usuario no esté repetido
            if (_context.Users.Any(u => u.UserName == request.Name))
            {
                return BadRequest("El nombre de usuario ya está en uso.");
            }

            // Opcional: Validar que el celular tampoco esté repetido
            if (_context.Users.Any(u => u.PhoneNumber == request.PhoneNumber))
            {
                return BadRequest("Este número de celular ya está registrado.");
            }

            // 2. Encriptar la contraseña con la misma lógica/llave que el Login
            var key = Encoding.UTF8.GetBytes("PencaMundialSecreta2026SuperLargaYSeguraParaQueNoFalle");
            string hashedPassword;

            using (var hmac = new System.Security.Cryptography.HMACSHA256(key))
            {
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password));
                hashedPassword = Convert.ToBase64String(hashBytes); // Lo convertimos a texto para guardarlo
            }

            // 3. Crear el nuevo usuario
            var newUser = new User
            {
                UserName = request.Name,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = hashedPassword // ¡Guardamos el hash seguro, nunca la clave plana!
            };

            // 4. Guardar en la base de datos
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "¡Usuario creado con éxito! Ya podés iniciar sesión." });
        }

    }
}
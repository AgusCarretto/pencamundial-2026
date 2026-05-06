using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PencaMundial.API.Data;
using PencaMundial.API.DTOs;
using PencaMundial.API.Models;

namespace PencaMundial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(UserCreateDto dto)
        {
            var user = new User
            {
                UserName = dto.UserName,
                PhoneNumber = dto.PhoneNumber,
                TotalPoints = 0
            };

            // Usamos el encriptador nativo de .NET
            var hasher = new PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var response = new UserResponseDto
            {
                Id = user.Id,
                UserName = user.UserName,
                TotalPoints = user.TotalPoints
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, response);
        }

        // GET: api/Users/global-ranking
        [HttpGet("global-ranking")]
        public async Task<ActionResult<IEnumerable<UserRankingDto>>> GetGlobalRanking()
        {
            // Traemos a todos, ordenamos por puntos y proyectamos al DTO
            var ranking = await _context.Users
                .OrderByDescending(u => u.TotalPoints)
                .Select(u => new UserRankingDto
                {
                    UserName = u.UserName,
                    TotalPoints = u.TotalPoints
                })
                .ToListAsync();

            return Ok(ranking);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return new UserResponseDto
            {
                Id = user.Id,
                UserName = user.UserName, 
                TotalPoints = user.TotalPoints
            };
        }
    }
}
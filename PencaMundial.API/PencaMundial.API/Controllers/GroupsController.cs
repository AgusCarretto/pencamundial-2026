using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PencaMundial.API.Data;
using PencaMundial.API.DTOs;
using PencaMundial.API.Models;

namespace PencaMundial.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GroupsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Groups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupResponseDto>>> GetMyGroups()
        {
            // Sacamos el nombre de usuario directamente del Token JWT
            var userName = User.Identity?.Name;

            // Buscamos al usuario en la BD e incluimos la lista de grupos a los que pertenece
            var user = await _context.Users
                .Include(u => u.Groups)
                .SingleOrDefaultAsync(u => u.UserName == userName);

            if (user == null) return NotFound("Usuario no encontrado.");

            // Transformamos las entidades Group a DTOs
            var response = user.Groups.Select(g => new GroupResponseDto
            {
                Id = g.Id,
                Name = g.Name,
                Code = g.Code
            }).ToList();

            return Ok(response);
        }

        // POST: api/Groups
        [HttpPost]
        public async Task<ActionResult<GroupResponseDto>> CreateGroup(GroupCreateDto dto)
        {
            // Buscamos al creador usando el Token
            var userName = User.Identity?.Name;
            var currentUser = await _context.Users.SingleOrDefaultAsync(u => u.UserName == userName);

            if (currentUser == null) return Unauthorized("Usuario no válido.");

            // Generamos un código único aleatorio de 6 caracteres (letras y números)
            string generatedCode = GenerateUniqueCode();

            var group = new Group
            {
                Name = dto.Name,
                Code = generatedCode,
                Users = new List<User> { currentUser } // <- El creador se agrega automáticamente al grupo
            };

            _context.Groups.Add(group);
            await _context.SaveChangesAsync();

            var response = new GroupResponseDto
            {
                Id = group.Id,
                Name = group.Name,
                Code = group.Code
            };

            return CreatedAtAction(nameof(GetGroup), new { id = group.Id }, response);
        }

        // GET: api/Groups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GroupResponseDto>> GetGroup(int id)
        {
            var group = await _context.Groups.FindAsync(id);

            if (group == null)
            {
                return NotFound();
            }

            return new GroupResponseDto
            {
                Id = group.Id,
                Name = group.Name,
                Code = group.Code
            };
        }

        // POST: api/Groups/join
        [HttpPost("join")]
        public async Task<IActionResult> JoinGroup([FromBody] JoinGroupDto dto)
        {
            // 1. Buscamos al usuario de forma segura con el Token
            var userName = User.Identity?.Name;
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == userName);

            if (user == null) return Unauthorized("Usuario no válido.");

            // 2. Buscamos el grupo por código (incluyendo la lista de usuarios actuales)
            var group = await _context.Groups
                .Include(g => g.Users)
                .SingleOrDefaultAsync(g => g.Code == dto.GroupCode.ToUpper());

            if (group == null) return NotFound("Código de grupo inválido.");

            // 3. Verificamos si el usuario ya está en este grupo
            if (group.Users.Any(u => u.Id == user.Id))
            {
                return BadRequest("Ya perteneces a este grupo.");
            }

            // 4. Lo agregamos y guardamos
            group.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Te uniste exitosamente al grupo: {group.Name}" });
        }

        // GET: api/Groups/{id}/ranking
        [HttpGet("{id}/ranking")]
        public async Task<ActionResult<IEnumerable<UserRankingDto>>> GetGroupRanking(int id)
        {
            // 1. Buscamos el grupo y le decimos a Entity Framework que "incluya" a los usuarios
            var group = await _context.Groups
                .Include(g => g.Users)
                .SingleOrDefaultAsync(g => g.Id == id);

            if (group == null)
            {
                return NotFound("El grupo no existe.");
            }

            // 2. Armamos el ranking ordenando por TotalPoints de forma descendente
            var ranking = group.Users
                .OrderByDescending(u => u.TotalPoints)
                .Select(u => new UserRankingDto
                {
                    UserName = u.UserName,
                    TotalPoints = u.TotalPoints
                })
                .ToList();

            return Ok(ranking);
        }

        // Método privado para generar el código (ej: "A7B9X2")
        private string GenerateUniqueCode()
        {
            // Crea un GUID, le saca los guiones, lo pasa a mayúsculas y toma los primeros 6 caracteres
            return Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
        }
    }
}
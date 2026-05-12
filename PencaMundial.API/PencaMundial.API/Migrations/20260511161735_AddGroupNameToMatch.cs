using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PencaMundial.API.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupNameToMatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GroupName",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GroupName",
                table: "Matches");
        }
    }
}

namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Songs",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(),
                        Tempo = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Sections",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Measures = c.Int(nullable: false),
                        Vocal = c.String(),
                        Song_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Songs", t => t.Song_Id)
                .Index(t => t.Song_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Sections", "Song_Id", "dbo.Songs");
            DropIndex("dbo.Sections", new[] { "Song_Id" });
            DropTable("dbo.Sections");
            DropTable("dbo.Songs");
        }
    }
}

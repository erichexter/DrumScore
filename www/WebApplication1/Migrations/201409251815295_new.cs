namespace Drumly.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _new : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.SongStorages", newName: "Storages");
            DropForeignKey("dbo.Beats", "Voice_Id", "dbo.Voices");
            DropForeignKey("dbo.Voices", "Measure_Id", "dbo.Measures");
            DropForeignKey("dbo.Voices", "Measure_Id1", "dbo.Measures");
            DropForeignKey("dbo.Measures", "Groove_Id", "dbo.Grooves");
            DropForeignKey("dbo.Sections", "Grooves_Id", "dbo.Grooves");
            DropForeignKey("dbo.Sections", "Song_Id", "dbo.Songs");
            DropIndex("dbo.Sections", new[] { "Grooves_Id" });
            DropIndex("dbo.Sections", new[] { "Song_Id" });
            DropIndex("dbo.Measures", new[] { "Groove_Id" });
            DropIndex("dbo.Voices", new[] { "Measure_Id" });
            DropIndex("dbo.Voices", new[] { "Measure_Id1" });
            DropIndex("dbo.Beats", new[] { "Voice_Id" });
            AddColumn("dbo.Storages", "Type", c => c.Int(nullable: false));
            DropTable("dbo.Songs");
            DropTable("dbo.Sections");
            DropTable("dbo.Grooves");
            DropTable("dbo.Measures");
            DropTable("dbo.Voices");
            DropTable("dbo.Beats");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Beats",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Position = c.Int(nullable: false),
                        InternalData = c.String(),
                        Voice_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Voices",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Position = c.Int(nullable: false),
                        Measure_Id = c.Guid(),
                        Measure_Id1 = c.Guid(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Measures",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Order = c.Int(nullable: false),
                        Groove_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Grooves",
                c => new
                    {
                        Id = c.Guid(nullable: false),
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
                        Order = c.Int(nullable: false),
                        Grooves_Id = c.Guid(),
                        Song_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Songs",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(),
                        Tempo = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            DropColumn("dbo.Storages", "Type");
            CreateIndex("dbo.Beats", "Voice_Id");
            CreateIndex("dbo.Voices", "Measure_Id1");
            CreateIndex("dbo.Voices", "Measure_Id");
            CreateIndex("dbo.Measures", "Groove_Id");
            CreateIndex("dbo.Sections", "Song_Id");
            CreateIndex("dbo.Sections", "Grooves_Id");
            AddForeignKey("dbo.Sections", "Song_Id", "dbo.Songs", "Id");
            AddForeignKey("dbo.Sections", "Grooves_Id", "dbo.Grooves", "Id");
            AddForeignKey("dbo.Measures", "Groove_Id", "dbo.Grooves", "Id");
            AddForeignKey("dbo.Voices", "Measure_Id1", "dbo.Measures", "Id");
            AddForeignKey("dbo.Voices", "Measure_Id", "dbo.Measures", "Id");
            AddForeignKey("dbo.Beats", "Voice_Id", "dbo.Voices", "Id");
            RenameTable(name: "dbo.Storages", newName: "SongStorages");
        }
    }
}

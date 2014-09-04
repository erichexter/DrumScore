namespace Drumly.Migrations
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
                        Order = c.Int(nullable: false),
                        Grooves_Id = c.Guid(),
                        Song_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Grooves", t => t.Grooves_Id)
                .ForeignKey("dbo.Songs", t => t.Song_Id)
                .Index(t => t.Grooves_Id)
                .Index(t => t.Song_Id);
            
            CreateTable(
                "dbo.Grooves",
                c => new
                    {
                        Id = c.Guid(nullable: false),
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
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Grooves", t => t.Groove_Id)
                .Index(t => t.Groove_Id);
            
            CreateTable(
                "dbo.Voices",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Position = c.Int(nullable: false),
                        Measure_Id = c.Guid(),
                        Measure_Id1 = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Measures", t => t.Measure_Id)
                .ForeignKey("dbo.Measures", t => t.Measure_Id1)
                .Index(t => t.Measure_Id)
                .Index(t => t.Measure_Id1);
            
            CreateTable(
                "dbo.Beats",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Position = c.Int(nullable: false),
                        InternalData = c.String(),
                        Voice_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Voices", t => t.Voice_Id)
                .Index(t => t.Voice_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Sections", "Song_Id", "dbo.Songs");
            DropForeignKey("dbo.Sections", "Grooves_Id", "dbo.Grooves");
            DropForeignKey("dbo.Measures", "Groove_Id", "dbo.Grooves");
            DropForeignKey("dbo.Voices", "Measure_Id1", "dbo.Measures");
            DropForeignKey("dbo.Voices", "Measure_Id", "dbo.Measures");
            DropForeignKey("dbo.Beats", "Voice_Id", "dbo.Voices");
            DropIndex("dbo.Beats", new[] { "Voice_Id" });
            DropIndex("dbo.Voices", new[] { "Measure_Id1" });
            DropIndex("dbo.Voices", new[] { "Measure_Id" });
            DropIndex("dbo.Measures", new[] { "Groove_Id" });
            DropIndex("dbo.Sections", new[] { "Song_Id" });
            DropIndex("dbo.Sections", new[] { "Grooves_Id" });
            DropTable("dbo.Beats");
            DropTable("dbo.Voices");
            DropTable("dbo.Measures");
            DropTable("dbo.Grooves");
            DropTable("dbo.Sections");
            DropTable("dbo.Songs");
        }
    }
}

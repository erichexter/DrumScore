namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class rework : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Grooves",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Order = c.Int(nullable: false),
                        Section_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Sections", t => t.Section_Id)
                .Index(t => t.Section_Id);
            
            CreateTable(
                "dbo.Voices",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Position = c.Int(nullable: false),
                        Name = c.Int(nullable: false),
                        InternalData = c.String(),
                        Groove_Id = c.Guid(),
                        Groove_Id1 = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Grooves", t => t.Groove_Id)
                .ForeignKey("dbo.Grooves", t => t.Groove_Id1)
                .Index(t => t.Groove_Id)
                .Index(t => t.Groove_Id1);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Grooves", "Section_Id", "dbo.Sections");
            DropForeignKey("dbo.Voices", "Groove_Id1", "dbo.Grooves");
            DropForeignKey("dbo.Voices", "Groove_Id", "dbo.Grooves");
            DropIndex("dbo.Voices", new[] { "Groove_Id1" });
            DropIndex("dbo.Voices", new[] { "Groove_Id" });
            DropIndex("dbo.Grooves", new[] { "Section_Id" });
            DropTable("dbo.Voices");
            DropTable("dbo.Grooves");
        }
    }
}

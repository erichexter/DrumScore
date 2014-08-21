namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class idgeneration : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Sections", "Song_Id", "dbo.Songs");
            DropPrimaryKey("dbo.Songs");
            DropPrimaryKey("dbo.Sections");
            AlterColumn("dbo.Songs", "Id", c => c.Guid(nullable: false, identity: true));
            AlterColumn("dbo.Sections", "Id", c => c.Guid(nullable: false, identity: true));
            AddPrimaryKey("dbo.Songs", "Id");
            AddPrimaryKey("dbo.Sections", "Id");
            AddForeignKey("dbo.Sections", "Song_Id", "dbo.Songs", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Sections", "Song_Id", "dbo.Songs");
            DropPrimaryKey("dbo.Sections");
            DropPrimaryKey("dbo.Songs");
            AlterColumn("dbo.Sections", "Id", c => c.Guid(nullable: false));
            AlterColumn("dbo.Songs", "Id", c => c.Guid(nullable: false));
            AddPrimaryKey("dbo.Sections", "Id");
            AddPrimaryKey("dbo.Songs", "Id");
            AddForeignKey("dbo.Sections", "Song_Id", "dbo.Songs", "Id");
        }
    }
}

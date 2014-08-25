namespace WebApplication1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class sectionorder : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Sections", "Order", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Sections", "Order");
        }
    }
}

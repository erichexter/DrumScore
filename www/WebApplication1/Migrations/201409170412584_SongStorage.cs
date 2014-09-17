namespace Drumly.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SongStorage : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SongStorages",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(),
                        InternalData = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.SongStorages");
        }
    }
}

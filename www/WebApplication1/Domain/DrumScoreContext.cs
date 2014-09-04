using System.Data.Entity;

namespace Drumly.Domain
{
    public class DrumScoreContext : DbContext
    {
        public DrumScoreContext()
        {
            Database.SetInitializer<DrumScoreContext>(new CreateDatabaseIfNotExists<DrumScoreContext>());
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Section>().HasOptional(d => d.Grooves);
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Song> Songs { get; set; }
    }
}
﻿using System.Data.Entity;

namespace WebApplication1.Domain
{
    public class DrumScoreContext : DbContext
    {
        public DrumScoreContext()
        {
            Database.SetInitializer<DrumScoreContext>(new CreateDatabaseIfNotExists<DrumScoreContext>());
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Song> Songs { get; set; }
    }
}
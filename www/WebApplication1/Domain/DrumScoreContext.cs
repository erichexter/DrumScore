﻿using System.Data.Entity;

namespace Drumly.Domain
{
    public class DrumScoreContext : DbContext
    {
        public DrumScoreContext()
        {
            Database.SetInitializer<DrumScoreContext>(new CreateDatabaseIfNotExists<DrumScoreContext>());
        }

        public DbSet<SongStorage> Storage { get; set; }
    }
}
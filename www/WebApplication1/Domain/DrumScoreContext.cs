using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace WebApplication1.Domain
{
    public class DrumScoreContext:DbContext
    {
        public DbSet<Song> Scores { get; set; }
    }
}
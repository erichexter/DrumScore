using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using Newtonsoft.Json;

namespace Drumly.Domain
{
    public class Groove:Entity
    {
        public virtual ICollection<Measure> Measures { get; set; } 
    }

    public class Measure : Entity
    { 
        public Measure()
        {
            Top=new List<Voice>();
            Bottom=new List<Voice>();
        }

        public int Order { get; set; }
        public virtual ICollection<Voice> Top { get; set; }
        public virtual ICollection<Voice> Bottom { get; set; }
       
    }
}
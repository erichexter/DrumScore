using System.Collections;
using System.Collections.Generic;

namespace WebApplication1.Domain
{
    public class Section : Entity
    {
        public Section()
        {
            Grooves=new List<Groove>();
        }

        public string Name { get; set; }
        public int Measures { get; set; }
        public virtual ICollection<Groove> Grooves { get; set; }
        public string Vocal { get; set; }
    }
}
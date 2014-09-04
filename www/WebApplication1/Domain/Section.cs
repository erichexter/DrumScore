using System.Collections;
using System.Collections.Generic;
using System.Security.Permissions;

namespace Drumly.Domain
{
    public class Section : Entity
    {

        public string Name { get; set; }
        public int Measures { get; set; }
        public virtual Groove Grooves { get; set; }
        public string Vocal { get; set; }
        public virtual Song Song { get; set; }
        public int Order { get; set; }
    }
}
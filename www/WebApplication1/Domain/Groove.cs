using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace WebApplication1.Domain
{
    public class Groove:Entity
    {
        public Groove()
        {
            Top=new List<Voice>();
            Bottom=new List<Voice>();
        }

        public int Order { get; set; }
        public virtual ICollection<Voice> Top { get; set; }
        public virtual ICollection<Voice> Bottom { get; set; }
    }
}
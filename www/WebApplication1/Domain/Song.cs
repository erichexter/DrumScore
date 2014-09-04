using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Drumly.Domain
{
    public class Song : Entity
    {
        public Song()
        {
            Sections = new List<Section>();
        }

        public string Title { get; set; }
        public int Tempo { get; set; }
        public virtual ICollection<Section> Sections { get; set; }
    }
}
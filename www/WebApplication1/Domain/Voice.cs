using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Drumly.Domain
{
    public class Voice:Entity
    {
        public Voice()
        {
        
        }

        public VoiceName Position { get; set; }

        public virtual ICollection<Beat> Beats { get; set; }

    }

    public class Beat : Entity
    {

        public int Position { get; set; }

        public string InternalData { get; set; }
        [NotMapped]
        public bool[] Notes
        {
            get
            {
                if (InternalData != null)
                    return Array.ConvertAll(InternalData.Split(';'), bool.Parse);
                else
                {
                    return new bool[16];
                }
            }
            set
            {
                var data = value;
                InternalData = String.Join(";", data.Select(p => p.ToString()).ToArray());
            }
        }
    }

}
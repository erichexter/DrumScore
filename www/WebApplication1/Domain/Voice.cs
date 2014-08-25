using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace WebApplication1.Domain
{
    public class Voice:Entity
    {
        public Voice()
        {
        
        }

        public int Position { get; set; }
        public VoiceName Name { get; set; }
        

        public string InternalData { get; set; }
        [NotMapped]
        public bool[] Notes
        {
            get
            {
                if(InternalData!=null)
                    return Array.ConvertAll(InternalData.Split(';'), bool.Parse);
                else
                {
                    return  new bool[16];
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
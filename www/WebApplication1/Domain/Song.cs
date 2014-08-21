using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Permissions;
using System.Web;
using System.Web.Helpers;
using Newtonsoft.Json;

namespace WebApplication1.Domain
{
    public class Song:Entity
    {
        public string Title { get; set; }
        public int Tempo { get; set; }
        public virtual List<Section> Sections { get; set; }
    }

    public class Entity
    {
        public Entity()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; set; }
    }

    public class Section : Entity
    {
        public Section()
        {
            Groove=new Groove(){HighHat = new bool[16],Kick = new bool[16],Snare = new bool[16]};
        }

        public string Name { get; set; }
        public int Measures { get; set; }
        public string GrooveString;

        public Groove Groove
        {
            get
            {
                return GrooveString.ToGroove();
            } 
            set
            {
                GrooveString = value.ToString();
            }
        }

        public string Vocal { get; set; }
    }

    public class Groove
    {
        public bool[] HighHat { get; set; }
        public bool[] Snare { get; set; }
        public bool[] Kick { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }

    public  static class StringExtensions
    {
        public static Groove ToGroove(this string input)
        {
            return JsonConvert.DeserializeObject<Groove>(input);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Web;
using System.Web.Helpers;
using Newtonsoft.Json;

namespace WebApplication1.Domain
{
    public class Song
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public int Tempo { get; set; }
        public virtual List<Section> Sections { get; set; }
    }

    public class Section
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Measures { get; set; }
        protected string _groove;

        public Groove Groove
        {
            get
            {
                return _groove.ToGroove();
            } 
            set
            {
                _groove = value.ToString();
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
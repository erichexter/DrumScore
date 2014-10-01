using System.ComponentModel.DataAnnotations.Schema;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Drumly.Domain
{
    public class Storage : Entity
    {
        public string Title { get; set; }
        public string InternalData { get; set; }
        public ObjectType Type { get; set; }
        [NotMapped]
        public dynamic Data
        {
            get
            {
                if (InternalData != null)
                    return JObject.Parse(InternalData);
                return null;
            }
            set
            {
                dynamic data = value;
                InternalData = JsonConvert.SerializeObject(data);
            }
        }
    }

    public enum ObjectType
    {
        Song=0,
        Set=1,
        App=2
    }
}
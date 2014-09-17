using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Drumly.Domain
{
    public class SongStorage : Entity
    {
        public string Title { get; set; }
        public string InternalData { get; set; }

        [NotMapped]
        public dynamic Song
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
}
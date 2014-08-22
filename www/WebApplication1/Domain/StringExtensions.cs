using Newtonsoft.Json;

namespace WebApplication1.Domain
{
    public static class StringExtensions
    {
        public static Groove ToGroove(this string input)
        {
            return JsonConvert.DeserializeObject<Groove>(input);
        }
    }
}
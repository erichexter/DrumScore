using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    public class AppController : Controller
    {
        // GET: App
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Sets()
        {
            return View();
        }
        public ActionResult Song()
        {
            return View();
        }

        public ActionResult CacheManifest()
        {
            return View();
        }
    }
}
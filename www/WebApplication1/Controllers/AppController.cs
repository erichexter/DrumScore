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
    }
}
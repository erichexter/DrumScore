using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Domain;

namespace WebApplication1.Controllers
{
    public class SongController : Controller
    {
        // GET: Song
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Edit(Guid Id)
        {
            using (var ctx = new DrumScoreContext())
            {
                var song = ctx.Songs.Single(s => s.Id == Id);
                return View("Edit",song);
            }
        }
    }
}
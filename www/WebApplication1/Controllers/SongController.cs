using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Drumly.Domain;

namespace Drumly.Controllers
{
    public class SongController : Controller
    {
        // GET: Song
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult New()
        {
            var model = new Song() { Title = "New song" };
            using (var context = new DrumScoreContext())
            {
                context.Songs.Add(model);
                context.SaveChanges();
            }
            return RedirectToAction("Edit",new{id=model.Id});
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
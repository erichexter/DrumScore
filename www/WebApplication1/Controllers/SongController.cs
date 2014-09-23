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

        public ActionResult Edit(Guid Id)
        {
            using (var ctx = new DrumScoreContext())
            {
                var song = ctx.Storage.Single(s => s.Id == Id);
                return View("Edit",song.Song);
            }
        }
    }
}
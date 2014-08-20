using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Domain;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            using (var context = new DrumScoreContext())
            {
                var scores=context.Scores.ToList();
                return View(scores);
            }            
        }


        public ActionResult New()
        {
            var model = new Song() {Title = "New song"};
            using (var context = new DrumScoreContext())
            {
                context.Scores.Add(model);
                context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
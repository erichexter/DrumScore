using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Drumly.Domain;

namespace WebApplication1.Controllers
{
    public class DataController : ApiController
    {
        private readonly DrumScoreContext db = new DrumScoreContext();


        public IHttpActionResult GetData(Guid id)
        {
            var storage = db.Storage.SingleOrDefault(s => s.Id == id);
            if (storage == null)
            {
                return NotFound();
            }
            return Ok(storage.Data);
        }


        [ResponseType(typeof(void))]
        public IHttpActionResult PutData(Guid id, dynamic song,ObjectType type)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != Guid.Parse(song.id.Value))
            {
                return BadRequest();
            }

            Storage storage = db.Set<Storage>().SingleOrDefault(e => e.Id == id);
            if (storage == null)
            {
                storage = new Storage { Type = type };
                storage.Id = id;
                db.Storage.Add(storage);
            }
            storage.Data = song;
            //storage.Title = song.title;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SongExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return StatusCode(HttpStatusCode.NoContent);
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SongExists(Guid id)
        {
            return db.Storage.Count(e => e.Id == id) > 0;
        }
    }
}

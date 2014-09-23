using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Drumly.Domain;
using WebGrease.Css.Extensions;

namespace Drumly.Controllers
{
    public class SongsController : ApiController
    {
        private readonly DrumScoreContext db = new DrumScoreContext();


        // GET: api/Songs/5
        
        public IHttpActionResult GetSong(Guid id)
        {
            SongStorage song = db.Storage.Single(s => s.Id == id);
            if (song == null)
            {
                return NotFound();
            }
            return Ok(song.Song);
        }

        [ResponseType(typeof(void))]
        public IHttpActionResult PutSong(Guid id, dynamic song)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != Guid.Parse(song.Id.Value))
            {
                return BadRequest();
            }

            var storage = db.Set<SongStorage>().SingleOrDefault(e => e.Id == id);
            if (storage == null)
            {
                storage=new SongStorage();
                storage.Id = id;
                db.Storage.Add(storage);
            }
            storage.Song = song;
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
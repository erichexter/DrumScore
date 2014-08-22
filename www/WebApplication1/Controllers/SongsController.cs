using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApplication1.Domain;

namespace WebApplication1.Controllers
{
    public class SongsController : ApiController
    {
        private DrumScoreContext db = new DrumScoreContext();

        // GET: api/Songs
        public IQueryable<Song> GetSongs()
        {
            return db.Songs;
        }

        // GET: api/Songs/5
        [ResponseType(typeof(Song))]
        public IHttpActionResult GetSong(Guid id)
        {
            Song song = db.Songs.Include(s=>s.Sections).Single(s=>s.Id==id);
            if (song == null)
            {
                return NotFound();
            }

            return Ok(song);
        }

        // PUT: api/Songs/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSong(Guid id, Song song)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != song.Id)
            {
                return BadRequest();
            }

            db.Entry(song).State = EntityState.Modified;

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
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Songs
        [ResponseType(typeof(Song))]
        public IHttpActionResult PostSong(Song song)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Songs.Add(song);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (SongExists(song.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = song.Id }, song);
        }

        // DELETE: api/Songs/5
        [ResponseType(typeof(Song))]
        public IHttpActionResult DeleteSong(Guid id)
        {
            Song song = db.Songs.Find(id);
            if (song == null)
            {
                return NotFound();
            }

            db.Songs.Remove(song);
            db.SaveChanges();

            return Ok(song);
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
            return db.Songs.Count(e => e.Id == id) > 0;
        }
    }
}
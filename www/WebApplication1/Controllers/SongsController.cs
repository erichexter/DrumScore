using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApplication1.Domain;
using WebGrease.Css.Extensions;

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
            var model = new {song.Id, song.Tempo,song.Title,Sections=song.Sections.OrderBy(s=>s.Order).Select(s=>new{s.Name,s.Measures,s.Vocal,s.Id,Grooves=s.Grooves.OrderBy(g=>g.Order).Select(g=>new Groove(){Id=g.Id,Top = g.Top.OrderBy(t=>t.Position).ToList(),Bottom = g.Bottom.OrderBy(b=>b.Position).ToList()}).ToList()})};
            return Ok(model);
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
            var dbsong = db.Songs.Single(e => e.Id == id);
            var updates = dbsong.Sections.Intersect(song.Sections).ToList();
            var inserts = song.Sections.Except(updates).ToList();
            var deletes = dbsong.Sections.Except(song.Sections).ToList();

            foreach (var delete in deletes)
            {
                dbsong.Sections.Remove(delete);                
            }
            foreach (var insert in inserts)
            {
                dbsong.Sections.Add(insert);
            }
            db.Set<Voice>().RemoveRange(deletes.SelectMany(r => r.Grooves.SelectMany(g=>g.Top)));
            db.Set<Voice>().RemoveRange(deletes.SelectMany(r => r.Grooves.SelectMany(g => g.Bottom)));
            db.Set<Groove>().RemoveRange(deletes.SelectMany(r => r.Grooves));
            db.Set<Section>().RemoveRange(deletes);
            db.Set<Section>().AddRange(inserts);
            updates.ForEach(r=>db.Entry(r).State=EntityState.Modified);

            
            dbsong.Tempo = song.Tempo;
            dbsong.Title = song.Title;

            int order=0;
            foreach (var section in song.Sections)
            {
                dbsong.Sections.Single(s => s.Id == section.Id).Order = order++;
                var gorder = 0;
                section.Grooves.ForEach(g=>g.Order=gorder++);
            }

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
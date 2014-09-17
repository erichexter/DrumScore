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

        // GET: api/Songs
        public IQueryable<Song> GetSongs()
        {
            return db.Songs;
        }

        // GET: api/Songs/5
        [ResponseType(typeof (Song))]
        public IHttpActionResult GetSong(Guid id)
        {
            Song song = db.Songs.Include(s => s.Sections).Single(s => s.Id == id);
            if (song == null)
            {
                return NotFound();
            }
            var model = new
            {
                song.Id,
                song.Tempo,
                song.Title,
                Sections = song.Sections.OrderBy(s => s.Order).Select(s =>
                    new
                    {
                        s.Name,
                        s.Measures,
                        s.Vocal,
                        s.Id,
                        Grooves = new
                        {
                            s.Grooves.Id,
                            Measures = s.Grooves.Measures.OrderBy(m => m.Order).Select(m => new
                            {
                                m.Id,
                                Bottom = m.Bottom.OrderBy(a => a.Position).ToList().Select(v=>new
                                {
                                    v.Position,
                                    v.Id,
                                    Beats=v.Beats.OrderBy(b=>b.Position)
                                }),
                                Top = m.Top.OrderBy(a => a.Position).ToList().Select(v => new
                                {
                                    v.Position,
                                    v.Id,
                                    Beats = v.Beats.OrderBy(b => b.Position)
                                }),
                            }).ToList()
                        }
                    }).ToList()
            };
            return Ok(model);
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
        // PUT: api/Songs/5
        //[ResponseType(typeof (void))]
        //public IHttpActionResult PutSong(Guid id, Song song)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != song.Id)
        //    {
        //        return BadRequest();
        //    }
        //    Song dbsong = db.Songs.Single(e => e.Id == id);
        //    List<Section> updates = dbsong.Sections.Intersect(song.Sections).ToList();
        //    List<Section> inserts = song.Sections.Except(updates).ToList();
        //    List<Section> deletes = dbsong.Sections.Except(song.Sections).ToList();

        //    foreach (Section delete in deletes)
        //    {
        //        dbsong.Sections.Remove(delete);
        //    }
        //    foreach (Section insert in inserts)
        //    {
        //        dbsong.Sections.Add(insert);
        //    }

        //    List<Voice> voices = deletes.SelectMany(r => r.Grooves.Measures.SelectMany(g => g.Top)).ToList();
        //    voices.AddRange(deletes.SelectMany(r => r.Grooves.Measures.SelectMany(g => g.Bottom)).ToList());

        //    List<Beat> beats = voices.Where(a => a.Beats != null).SelectMany(v => v.Beats).ToList();
        //    db.Set<Beat>().RemoveRange(beats);
        //    db.Set<Voice>().RemoveRange(voices);
        //    db.Set<Measure>().RemoveRange(deletes.SelectMany(r => r.Grooves.Measures));
        //    db.Set<Section>().RemoveRange(deletes);
        //    db.Set<Section>().AddRange(inserts);
        //    updates.ForEach(r => db.Entry(r).State = EntityState.Modified);


        //    dbsong.Tempo = song.Tempo;
        //    dbsong.Title = song.Title;

        //    int order = 0;

        //    foreach (Section section in song.Sections)
        //    {
        //        dbsong.Sections.Single(s => s.Id == section.Id).Order = order++;
        //        int gorder = 0;
        //        section.Grooves.Measures.ForEach(g => g.Order = gorder++);
        //        int morder = 0;
        //        foreach (Measure m in section.Grooves.Measures)
        //        {
        //            m.Order = morder++;
        //            foreach (Voice b in m.Bottom)
        //            {
        //                int border = 0;
        //                foreach (Beat be in b.Beats)
        //                {
        //                    be.Position = border++;
        //                }
        //            }
        //            foreach (Voice b in m.Top)
        //            {
        //                int border = 0;
        //                foreach (Beat be in b.Beats)
        //                {
        //                    be.Position = border++;
        //                }
        //            }
        //        }
        //    }

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!SongExists(id))
        //        {
        //            return NotFound();
        //        }
        //        throw;
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // POST: api/Songs
        [ResponseType(typeof (Song))]
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
                throw;
            }

            return CreatedAtRoute("DefaultApi", new {id = song.Id}, song);
        }

        // DELETE: api/Songs/5
        [ResponseType(typeof (Song))]
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
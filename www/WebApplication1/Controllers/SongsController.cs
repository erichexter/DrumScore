﻿using System;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Drumly.Domain;

namespace Drumly.Controllers
{
    public class SongsController : ApiController
    {
        private readonly DrumScoreContext db = new DrumScoreContext();


        // GET: api/Songs/5

        public IHttpActionResult GetSong(Guid id)
        {
            Storage storage = db.Storage.Single(s => s.Id == id);
            if (storage == null)
            {
                return NotFound();
            }
            return Ok(storage.Data);
        }

        [ResponseType(typeof (void))]
        public IHttpActionResult PutSong(Guid id, dynamic song)
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
                storage = new Storage {Type = ObjectType.Song};
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
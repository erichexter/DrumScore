function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function SetViewModel() {
    var self = this;
    self.changed = ko.observable(true);
    self.title = ko.observable();
    self.songs = ko.observableArray();
    self.id = ko.observable(guid());
    self.allsongs = new Array();
    self.changed = ko.observable(false);
    self.load = function(id) {
        self.id(id);
        var app = store.get('app');

        for (var i = 0; i < app.sets.length; i++) {
            if (app.sets[i].id === id) {
                var set = app.sets[i];
                self.title(set.title);
            }
        }

        for (var i = 0; i < app.songs.length; i++) {
            self.allsongs.push(app.songs[i]);
        }

        var data = store.get(id);
        if (data != undefined && data.songs != undefined) {
            for (i = 0; i < data.songs.length; i++) {
                var set1 = data.songs[i];
                self.songs.push(new song(set1.title, set1.id));
            }
        }
        if (data != undefined) {
            self.changed(data.changed);
        } else {
            self.changed(true);
        }
    };

    self.save = function() {
        //self.changed(true);
        store.set(self.id(), ko.toJS(self));
    };

    self.addSong = function(data) {
        self.songs.push(new song(data.title, data.id));
        self.changed(true);
        self.save();
    };
    self.sync = function () {
        if (self.changed()) {
            $.ajax({
                url: "/api/data/" + self.id() + "?type=set",
                type: "Put",
                data: ko.toJSON(self),
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                },
                error: function() { alert('error'); }
            });
        }
        self.changed(false);
        self.save();

    };
}

function guid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group

function AppViewModel() {
    var self = this;
    self.changed = ko.observable(true);
    self.id = ko.observable(guid());
    self.onchange = function () {
    };
    self.songs = ko.observableArray();
    self.sets = ko.observableArray();
    self.addSong = function () {
        var name = window.prompt("Song Name", "New Song " + (self.songs().length + 1));
        if (name != null) {
            var index = new song(name);
            self.songs.push(index);
            self.onchange();
            var s = new SongViewModel();
            s.id(index.id());
            s.title(index.title());
            s.save();
            self.changed(true);
        }
    };

    self.download = function(id) {
        $.ajax({
            url: "/api/Data/" + id,
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                self.internalLoad(data);
                self.downloadSets();
                self.save();
            },
            error: function() {
                 alert('error');
            }
        });
    };

    self.downloadSets = function () {
        for (i = 0; i < self.sets().length; i++) {
            var set1 = self.sets()[i];
            var id = set1.id();
            if (store.get(id) == undefined)
            {                
                $.ajax({
                    url: "/api/Data/" + id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        data.changed = false;
                        store.set(id, data);
                        var set = new SetViewModel();
                        set.load(id);
                        for (var j = 0; j < set.songs(); j++) {
                            var songid = set.songs()[j].id();
                            self.downloadSong(songid);
                        }
                    },
                    error: function () {
                        alert('error');
                    }
                });
            }
        }

    };

    self.downloadSong = function(id) {
        $.ajax({
            url: "/api/Data/" + id,
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                store.set(id, data);
            },
            error: function () {
                alert('error');
            }
        });
    };
    

    self.shareCloud = function() {
        window.prompt("Cloud Key: ctrl+c to copy ", self.id());
    };
    self.downloadCloud = function() {
        var name = window.prompt("Cloud Key", "");
        if (name != null) {
            self.download(name);
        }
    };
    self.addSet = function () {
        var name = window.prompt("Set Name", "New Set " + (self.sets().length + 1));
        if (name != null) {
            var self1 = new set(name);
            self.sets.push(self1);
            self.onchange();
            self.changed(true);
            var set2 = new SetViewModel();
            set2.load(self1.id());
            set2.save();
        }
    };

    self.internalLoad = function(data) {
        if (data != undefined && data.sets != undefined) {
            for (i = 0; i < data.sets.length; i++) {
                var set1 = data.sets[i];
                self.sets.push(new set(set1.title, set1.id));
            }
        }
        if (data != undefined && data.songs != undefined) {
            for (i = 0; i < data.songs.length; i++) {
                var set1 = data.songs[i];
                self.songs.push(new song(set1.title, set1.id));
            }
        }
        if (data != undefined && data.id != undefined) {
            self.id(data.id);
        } else {
            self.id(guid());
        }
        self.changed(false);
    };
    self.load = function () {
        var data = store.get('app');
        if (data != undefined) {
            self.internalLoad(data);

            self.changed(data.changed);
        }
    };

    self.save = function() {
        var jsonData = ko.toJS(self);
            store.set('app', jsonData);
    };

    self.sync = function () {
        if (self.changed()) {
            $.ajax({
                url: "/api/Data/" + self.id() + "/?type=App",
                type: "Put",
                data: ko.toJSON(self),
                contentType: 'application/json; charset=utf-8',
                success: function(data) {
                },
                error: function() { alert('error'); }
            });
            self.changed(false);
            for (i = 0; i < self.sets().length; i++) {
                var set = new SetViewModel();
                set.load(self.sets()[i].id());
                set.sync();
            }
            for (i = 0; i < self.songs().length; i++) {
                var song = new SongViewModel();
                song.load(self.songs()[i].id());
                song.sync();
            }
        }
    };
}

function song(title, id) {
    var self = this;
    self.title = ko.observable();
    self.title(title);
    self.id = ko.observable();
    if (id == undefined) {
        self.id(guid());
    } else {
        self.id(id);
    }
}

function set(title, id) {
    self = this;
    self.title = ko.observable();
    self.title(title);
    self.id = ko.observable();
    if (id == undefined) {
        self.id(guid());
    } else {
        self.id(id);
    }
}
function SongViewModel() {
    var self = this;
    self.sections = ko.observableArray();
    self.title = ko.observable();
    self.id = ko.observable();
    self.changed = ko.observable(true);

    self.sections.subscribe(function() {
        self.save();
    });

    self.title.subscribe(function () {
        self.save();
    });

    self.save = function () {
        var object = ko.toJS(self);
        object.changed = true;
        store.set(self.id(), object);
        //for a title change upate the app object.
    };

    self.load = function load(id) {
        var data = store.get(id);
        if (data!=undefined) {
            self.create(data);
        }
        self.id(id);
    };

    self.create = function(data) {
        self.title(data.title);
        self.id(data.id);
        if (data.sections != undefined)
        for (var i = 0; i < data.sections.length; i++) {
            var sec = data.sections[i];
            var sec1 = new section(sec);
            sec1.changed = function () {
                self.save();
            };
            self.sections.push(sec1);
        }
    };


    self.add = function () {
        var section1 = new section({
            name: "section",
            measures: 8,
            vocal: "vocal queue",
            grooves: { measures: [] }
        }
        );
        section1.add();
        self.sections.push(section1);
    };

    self.addGroove = function (data) {
        data.add();
    };

    self.sync = function() {
        var id = self.id();
        $.ajax({
            url: "/api/Songs/" + id,
            type: "Put",
            data: ko.toJSON(self),
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
            },
            error: function() { alert('error'); }
        });
    };

}
function section(data) {
    var self = this;

    self.changed = function() {
    };

    self.id = ko.observable(data.id);
    self.name = ko.observable(data.name);
    self.measures = ko.observable(data.measures);
    self.grooves = ko.observable();
    self.vocal = ko.observable(data.vocal);

    self.name.subscribe(function() {
        self.changed();
    });

    self.vocal.subscribe(function () {
        self.changed();
    });

    self.grooves.subscribe(function () {
        self.changed();
    });


    var g = new groove();
    g.timeSignature.beats = 4;
    g.timeSignature.value = 4;
    g.bottomrest = "e/4";
    g.toprest = "e/5";

    self.grooves(g);

    for (var i = 0; i < data.grooves.measures.length; i++) {
        g.addMeasure();
        var measure = data.grooves.measures[i];

        for (var j = 0; j < measure.top.length; j++) {
            var v = measure.top[j];
            g.measures[i].addTop();
            g.measures[i].top[j].position = v.position;
            for (var k = 0; k < v.beats.length; k++) {
                g.measures[i].top[j].addBeat();
                g.measures[i].top[j].beats[k].notes = v.beats[k].notes;
            }
        }

        for (var j = 0; j < measure.bottom.length; j++) {
            var v = measure.bottom[j];
            g.measures[i].addBottom();
            g.measures[i].bottom[j].position = v.position;
            for (var k = 0; k < v.beats.length; k++) {
                g.measures[i].bottom[j].addBeat();
                g.measures[i].bottom[j].beats[k].notes = v.beats[k].notes;
            }
        }
    }

    self.add = function () {
        var g = self.grooves();
        g.addMeasure();
        var index = g.measures.length - 1;
        g.measures[index].addBottom();
        g.measures[index].bottom[0].position = 2;//kick
        g.measures[index].bottom[0].addBeat();
        g.measures[index].bottom[0].addBeat();
        g.measures[index].bottom[0].addBeat();
        g.measures[index].bottom[0].addBeat();
        g.measures[index].bottom[0].beats[0].notes = [1, 0, 0, 0];
        g.measures[index].bottom[0].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].bottom[0].beats[2].notes = [1, 0, 0, 0];
        g.measures[index].bottom[0].beats[3].notes = [0, 0, 0, 0];


        g.measures[index].addTop();
        g.measures[index].top[0].position = 4;//floor tom
        g.measures[index].top[0].addBeat();
        g.measures[index].top[0].addBeat();
        g.measures[index].top[0].addBeat();
        g.measures[index].top[0].addBeat();
        g.measures[index].top[0].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[0].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[0].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[0].beats[3].notes = [0, 0, 0, 0];

        g.measures[index].addTop();
        g.measures[index].top[1].position = 6;//snare
        g.measures[index].top[1].addBeat();
        g.measures[index].top[1].addBeat();
        g.measures[index].top[1].addBeat();
        g.measures[index].top[1].addBeat();
        g.measures[index].top[1].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[1].beats[1].notes = [1, 0, 0, 0];
        g.measures[index].top[1].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[1].beats[3].notes = [1, 0, 0, 0];

        g.measures[index].addTop();
        g.measures[index].top[2].position = 7;//rim shot
        g.measures[index].top[2].addBeat();
        g.measures[index].top[2].addBeat();
        g.measures[index].top[2].addBeat();
        g.measures[index].top[2].addBeat();
        g.measures[index].top[2].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[2].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[2].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[2].beats[3].notes = [0, 0, 0, 0];

        g.measures[index].addTop();
        g.measures[index].top[3].position = 8;//tom 2
        g.measures[index].top[3].addBeat();
        g.measures[index].top[3].addBeat();
        g.measures[index].top[3].addBeat();
        g.measures[index].top[3].addBeat();
        g.measures[index].top[3].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[3].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[3].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[3].beats[3].notes = [0, 0, 0, 0];

        g.measures[index].addTop();
        g.measures[index].top[4].position = 9;//tom1
        g.measures[index].top[4].addBeat();
        g.measures[index].top[4].addBeat();
        g.measures[index].top[4].addBeat();
        g.measures[index].top[4].addBeat();
        g.measures[index].top[4].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[4].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[4].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[4].beats[3].notes = [0, 0, 0, 0];

        g.measures[index].addTop();
        g.measures[index].top[5].position = 10;//tom1 rims
        g.measures[index].top[5].addBeat();
        g.measures[index].top[5].addBeat();
        g.measures[index].top[5].addBeat();
        g.measures[index].top[5].addBeat();
        g.measures[index].top[5].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[5].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[5].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[5].beats[3].notes = [0, 0, 0, 0];

        g.measures[index].addTop();
        g.measures[index].top[6].position = 11;//hihat closed
        g.measures[index].top[6].addBeat();
        g.measures[index].top[6].addBeat();
        g.measures[index].top[6].addBeat();
        g.measures[index].top[6].addBeat();
        g.measures[index].top[6].beats[0].notes = [1, 0, 1, 0];
        g.measures[index].top[6].beats[1].notes = [1, 0, 1, 0];
        g.measures[index].top[6].beats[2].notes = [1, 0, 1, 0];
        g.measures[index].top[6].beats[3].notes = [1, 0, 1, 0];

        g.measures[index].addTop();
        g.measures[index].top[7].position = 12;//hihat open
        g.measures[index].top[7].addBeat();
        g.measures[index].top[7].addBeat();
        g.measures[index].top[7].addBeat();
        g.measures[index].top[7].addBeat();
        g.measures[index].top[7].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[7].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[7].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[7].beats[3].notes = [0, 0, 0, 0];

        g.measures[index].addTop();
        g.measures[index].top[8].position = 13;//ride
        g.measures[index].top[8].addBeat();
        g.measures[index].top[8].addBeat();
        g.measures[index].top[8].addBeat();
        g.measures[index].top[8].addBeat();
        g.measures[index].top[8].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[8].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[8].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[8].beats[3].notes = [0, 0, 0, 0];


        g.measures[index].addTop();
        g.measures[index].top[9].position = 14;//crash
        g.measures[index].top[9].addBeat();
        g.measures[index].top[9].addBeat();
        g.measures[index].top[9].addBeat();
        g.measures[index].top[9].addBeat();
        g.measures[index].top[9].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[9].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[9].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[9].beats[3].notes = [0, 0, 0, 0];

        g.measures[index].addTop();
        g.measures[index].top[10].position = 15;//accent
        g.measures[index].top[10].addBeat();
        g.measures[index].top[10].addBeat();
        g.measures[index].top[10].addBeat();
        g.measures[index].top[10].addBeat();
        g.measures[index].top[10].beats[0].notes = [0, 0, 0, 0];
        g.measures[index].top[10].beats[1].notes = [0, 0, 0, 0];
        g.measures[index].top[10].beats[2].notes = [0, 0, 0, 0];
        g.measures[index].top[10].beats[3].notes = [0, 0, 0, 0];


        //.addArticulation(0, new Vex.Flow.Articulation("a@a").setPosition(3))

        self.grooves(g);
    };
}

function durationstring(data) {
    if (data == 1 / 16)
        return "16";
    if (data == 2 / 16) {
        return "8";
    }
    if (data == 3 / 16) {
        return "8d";
    }
    if (data == 4 / 16) {
        return "q";
    }
}

function voiceToBeats(voices, rest, b, direction) {

    var notes = voices[0].beats[b].notes.slice();
    for (v = 0; v < voices.length; v++) {
        for (var n = 0; n < notes.length; n++) {
            notes[n] = voices[v].beats[b].notes[n] || notes[n];
        }
    }

    var combineNotes = new Array();
    for (z = 0; z < notes.length; z++) {
        var duration = 1 / 16;
        if (notes[z] == 1) {
            var accent = false;
            var keys = new Array();
            for (k = 0; k < voices.length; k++) {
                if (voices[k].beats[b].notes[z] == 1) {
                    var key1 = key(voices[k].position);
                    if (key1 != null) {
                        keys.push(key1);
                    }
                }
                if (voices[k].beats[b].notes[z] == 1 && voices[k].position == 15) {
                    accent = true;                    
                }
            }

            for (y = z + 1; y < notes.length; y++) {
                if (notes[y] == 0) {
                    duration = duration + (1 / 16);
                } else {

                    break;
                }
                z = y;
            }
            var dstring = durationstring(duration);
            var staveNote = new Vex.Flow.StaveNote({ keys: keys, duration: dstring, stem_direction: direction });
            if (accent) {
                staveNote.addArticulation(0, new Vex.Flow.Articulation("a>").setPosition(3));
            }
            combineNotes.push(staveNote);
        } else {
            for (y = z + 1; y < notes.length; y++) {
                if (notes[y] == 0) {
                    duration = duration + (1 / 16);
                } else {
                    break;
                }
                z = y;
            }
            var dstring = durationstring(duration);
            combineNotes.push(new Vex.Flow.StaveNote({ keys: [rest], duration: dstring + "r", stem_direction: direction }));
        }

    }
    return combineNotes;
}
function name(position) {
    if (position == 0)
        return "d/4";
    if (position == 1)
        return "kick 2";
    if (position == 2)
        return "kick";
    if (position == 3)
        return "g/4";
    if (position == 4)
        return "floor tom";
    if (position == 5)
        return "b/5";
    if (position == 6)
        return "snare";
    if (position == 7)
        return "snare Rim shot";
    if (position == 8)
        return "tom 2";
    if (position == 9)
        return "tom 1";
    if (position == 10)
        return "tom rims";
    if (position == 11)
        return "hihat closed";
    if (position == 12)
        return "hihat open";
    if (position == 13)
        return "ride";
    if (position == 14)
        return "crash";
    if (position == 15)
        return "accents";
    return "";
}
function key(position) {
    if (position == 0)
        return "d/4";
    if (position == 1)
        return "e/4";
    if (position == 2)
        return "f/4";
    if (position == 3)
        return "g/4";
    if (position == 4)
        return "a/4";
    if (position == 5)
        return "b/5";
    if (position == 6)
        return "c/5";
    if (position == 7)
        return "c/5/x2";
    if (position == 8)
        return "d/5";
    if (position == 9)
        return "e/5";
    if (position == 10)
        return "e/5/x2";
    if (position == 11)
        return "f/5/x2";
    if (position == 12)
        return "f/5/x3";
    if (position == 13)
        return "g/5";
    if (position == 14)
        return "g/5/x3";
    return null;
    /*
    1 e  
    2 f  kick
    3 g  
    4 a  floor tom
    5 b
    6 c  snare
        
    9 f hh
    10 g */
}

function draw(canvas, groove) {

    canvas.width = 300 * groove.measures.length ;
    var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    var ctx = renderer.getContext();
    var stave = new Vex.Flow.Stave(0, 8, canvas.width-2);
    //stave.addClef("percussion");
        //.addTimeSignature(groove.timeSignature.beats + "/" + groove.timeSignature.value, 10);
    stave.setContext(ctx).draw();

    var beams = new Array();
    var voices = new Array();

    var voice = new Vex.Flow.Voice({
        num_beats: groove.timeSignature.beats,
        beat_value: groove.timeSignature.value,
        resolution: Vex.Flow.RESOLUTION
    });
    voice.setStrict(false);
    for (var m = 0; m < groove.measures.length; m++)
    {
        if (m > 0) {
            voice.addTickables([new Vex.Flow.BarNote()]);
        }
        var measure = groove.measures[m];
        for (var b = 0; b < groove.timeSignature.beats; b++) {
            var bottom = voiceToBeats(measure.bottom, groove.bottomrest, b, -1);
            if (bottom.length > 1)
                beams.push(new Vex.Flow.Beam(bottom));
            voice.addTickables(bottom);
        }
    }
    voices.push(voice);

    var voice1 = new Vex.Flow.Voice({
        num_beats: groove.timeSignature.beats,
        beat_value: groove.timeSignature.value,
        resolution: Vex.Flow.RESOLUTION
    });
    voice1.setStrict(false);
    for (var m = 0; m < groove.measures.length; m++) {
        if (m > 0) {
            voice1.addTickables([new Vex.Flow.BarNote()]);
        }
        var measure = groove.measures[m];
        for (var b = 0; b < groove.timeSignature.beats; b++) {
            var top = voiceToBeats(measure.top, groove.toprest, b, 1);
            if (top.length > 1)
                beams.push(new Vex.Flow.Beam(top));
            voice1.addTickables(top);
        }
    }
    voices.push(voice1);


    var formatter = new Vex.Flow.Formatter().joinVoices(voices).format(voices, stave.width - 55);

    for (var i = 0; i < voices.length; i++) {
        voices[i].draw(ctx, stave);
    }

    for (var i = 0; i < beams.length; i++) {
        beams[i].setContext(ctx).draw();
    }
}

function groove() {
    var self = this;
    self.measures = new Array();
    self.timeSignature = { beats: 4, value: 4 };
    self.addMeasure = function() {
        self.measures.push(new measure());
    };
}

function measure() {
    var self = this;

    self.top = new Array();
    self.bottom = new Array();

    self.addTop = function() {
        self.top.push(new measurebeat());
    };

    self.addBottom = function() {
        self.bottom.push(new measurebeat());
    };
}

function measurebeat() {
    var self = this;
    self.position = "";
    self.beats = new Array();
    self.addBeat = function() {
        self.beats.push(new beat());
    };
}

function beat(data) {
    var self1 = this;
    self1.postition = 0;
    self1.notes = new Array();
}
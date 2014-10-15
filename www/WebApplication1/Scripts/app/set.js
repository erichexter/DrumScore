  function SetViewModel() {
    var self = this;
    self.currentSongIndex = ko.observable(0);
    self.currentSong = ko.observable();
    self.changed = ko.observable(true);
    self.title = ko.observable();
    self.songs = ko.observableArray();
    self.id = ko.observable(guid());
    self.allsongs = new Array();
    self.changed = ko.observable(false);


    self.load = function (id) {
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
        if (data != undefined) {
            if (data != undefined && data.songs != undefined) {
                for (i = 0; i < data.songs.length; i++) {
                    var set1 = data.songs[i];
                    //check for song title from song.
                    var s = new song(set1.title, set1.id);
                    var songvm = s.getSong();
                    if (songvm!=undefined && songvm.title() != s.title()) {
                        s.title(songvm.title());
                    }
                    self.songs.push(s);
                }
            }
            if (data.changed != undefined) {
                self.changed(data.changed);
            } else {
                self.changed(true);
            }
            if (data.currentSongIndex != undefined) {
                self.currentSongIndex(data.currentSongIndex);
                self.changeSong(self.currentSongIndex());
            }
        }        
    };

    self.removeSong = function(index) {
        self.songs.splice(index,1);
        self.changed(true);
        self.changeSong(0);
        self.save();
    };
    
    self.previousSong = function() {
        if (self.currentSongIndex() >0) {
            self.changeSong(self.currentSongIndex() - 1);
        }
    };
    self.nextSong = function() {
        if (self.currentSongIndex()+1 < self.songs().length ) {
            self.changeSong(self.currentSongIndex() + 1);
        }
    };
    self.firstSong = function() {
        self.changeSong(0);
    };
    self.lastSong = function() {
        self.changeSong(self.songs().length-1);
    };
    self.changeSong = function (index) {
        var song = self.songs()[index];
        if (song != undefined) {
            var songVM = song.getSong();            
            if (songVM != undefined) {                
                self.currentSong(songVM);
                self.currentSongIndex(index);
            }
        }
    };

    self.selectSong = function (song) {
        var data = store.get(song.id());
        var songVM = new SongViewModel();
        songVM.create(data);
        self.currentSong(songVM);
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
        if (navigator.onLine) {
            if (self.changed()) {
                $.ajax({
                    url: "/api/data/" + self.id() + "?type=set",
                    type: "Put",
                    data: ko.toJSON(self),
                    contentType: 'application/json; charset=utf-8',
                    success: function(data) {
                    },
                    error: function (xhr) {
                        if(console && console.log)
                            console.log(xhr.status +  " " + xhr.responseText);
                    }
                });
            }
            self.changed(false);
            self.save();
        }
    };
}
// then to call it, plus stitch in '4' in the third group

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

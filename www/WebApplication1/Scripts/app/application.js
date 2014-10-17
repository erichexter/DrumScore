function Application() {
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

    self.download = function (id) {
        $.ajax({
            url: "/api/Data/" + id,
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                self.internalLoad(data);
                self.downloadSongs();
                self.downloadSets();                
                self.save();
            },
            error: function (xhr) {
                if (console && console.log)
                    console.log(xhr.status + " " + xhr.responseText);
            }
        });
    };

    self.downloadSets = function () {
        for (i = 0; i < self.sets().length; i++) {
            var set1 = self.sets()[i];
            var id = set1.id();
            if (store.get(id) == undefined) {
                $.ajax({
                    url: "/api/Data/" + id,
                    type: "Get",
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        data.changed = false;
                        store.set(id, data);
                        var set = new SetViewModel();
                        set.load(id);
                        for (var j = 0; j < set.songs() ; j++) {
                            var songid = set.songs()[j].id();
                            self.downloadSong(songid);
                        }
                    },
                    error: function (xhr) {
                        if (console && console.log)
                            console.log(xhr.status + " " + xhr.responseText);
                    }
                });
            }
        }

    };
    self.downloadSongs = function () {
        for (i = 0; i < self.songs().length; i++) {
            var song = self.songs()[i];
            self.downloadSong(song.id());
        }
    };

    self.downloadSong = function (id) {
        $.ajax({
            url: "/api/Data/" + id,
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                var songvm = new SongViewModel();
                songvm.create(data);
                songvm.save();
                ///store.set(id, data);
            },
            error: function (xhr) {
                if (console && console.log)
                    console.log(xhr.status + " " + xhr.responseText);
            }
        });
    };


    self.shareCloud = function () {
        window.prompt("Cloud Key: ctrl+c to copy ", self.id());
        self.changed(true);
        self.sync();
    };
    self.downloadCloud = function () {
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

    self.internalLoad = function (data) {
        if (data != undefined && data.sets != undefined) {
            for (i = 0; i < data.sets.length; i++) {
                var set1 = data.sets[i];
                self.sets.push(new set(set1.title, set1.id));
            }
        }
        if (data != undefined && data.songs != undefined) {
            for (i = 0; i < data.songs.length; i++) {
                var s1 = data.songs[i];
                var s2 = new song(s1.title, s1.id);
                var s3 = s2.getSong();
                if (s3!=undefined && s2.title() != s3.title()) {
                    s2.title(s3.title());
                }
                self.songs.push(s2);
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

    self.save = function () {
        var jsonData = ko.toJS(self);
        store.set('app', jsonData);
    };

    self.sync = function () {
        if (navigator.onLine) {
            if (self.changed()) {
                $.ajax({
                    url: "/api/Data/" + self.id() + "/?type=App",
                    type: "Put",
                    data: ko.toJSON(self),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                    },
                    error: function (xhr) {
                        if (console && console.log)
                            console.log(xhr.status + " " + xhr.responseText);
                    }
                });
                self.changed(false);
                self.save();
            }
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

    };
}

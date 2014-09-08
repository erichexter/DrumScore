
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

    var bottom = new Array();
    for (z = 0; z < notes.length; z++) {
        var duration = 1 / 16;
        if (notes[z] == 1) {
            var keys = new Array();
            for (k = 0; k < voices.length; k++) {
                if (voices[k].beats[b].notes[z] == 1) {
                    keys.push(key(voices[k].position));
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
            bottom.push(new Vex.Flow.StaveNote({ keys: keys, duration: dstring, stem_direction: direction }));
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
            bottom.push(new Vex.Flow.StaveNote({ keys: [rest], duration: dstring + "r", stem_direction: direction }));
        }

    }
    return bottom;
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
        return "snare Rimshot";
    if (position == 8)
        return "tom 2";
    if (position == 9)
        return "tom 1";
    if (position == 10)
        return "high hat";
    if (position == 11)
        return "high hat open";
    if (position == 12)
        return "ride";
    if (position == 13)
        return "crash";
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
        return "f/5/x2";
    if (position == 11)
        return "f/5/x3";
    if (position == 12)
        return "g/5";
    if (position == 13)
        return "g/5/x3";

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

    canvas.width = 275 * groove.measures.length;
    var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    var ctx = renderer.getContext();
    var stave = new Vex.Flow.Stave(10, 0, canvas.width - 20);
    stave.addClef("percussion")
        .addTimeSignature(groove.timeSignature.beats + "/" + groove.timeSignature.value, 15);
    stave.setContext(ctx).draw();

    var beams = new Array();
    var voices = new Array();

    var voice = new Vex.Flow.Voice({
        num_beats: groove.timeSignature.beats,
        beat_value: groove.timeSignature.value,
        resolution: Vex.Flow.RESOLUTION
    });
    for (var m = 0; m < groove.measures.length; m++) {
        voice.addTickables([new Vex.Flow.BarNote()]);
        voice.setStrict(false);
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
    for (var m = 0; m < groove.measures.length; m++) {
        voice1.addTickables([new Vex.Flow.BarNote()]);
        voice1.setStrict(false);
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
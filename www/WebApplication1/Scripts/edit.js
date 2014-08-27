        function flatenBeats(arrayOf16thNotes) {
            var output = arrayOf16thNotes[0].slice();
            for (var index = 0; index < arrayOf16thNotes[0].length; index++) {
                for (var j = 0; j < arrayOf16thNotes.length; j++) {
                    if (arrayOf16thNotes[j][index] == 1) {
                        output[index] = 1;
                    }                    
                }
            }
            return output;
        }

        function getNotes(beatNotes, measureNotes, index) {
            var output = [];
            for (var i = 0; i < measureNotes.length;i++) {
                if (measureNotes[i][index] == 1) {
                    output.push(beatNotes[i]);
                }
            }
            return output;
        }

        function getBeats(measureNotes,beatNotes,restNote,direction) {
            var notes = [];
            var beams = [];

            for (index = 0; index < measureNotes[0].length / 4; index++) {
                var beat = [];
                var beatIndex = index * 4;
                var measure = flatenBeats(measureNotes);
                //var measure = measureNotes[0];
                if (measure[beatIndex + 3] == 1) { //a
                    //2nd 8th is a 16th (beat) or rest.
                    if (measure[beatIndex + 2] == 1) { // &
                        //first beat is a 16th note
                        if (measure[beatIndex + 1] == 1) { //e

                            if (measure[beatIndex] == 1) { //1
                                
                                beat.push({ duration: "16", keys: getNotes(beatNotes,measureNotes, beatIndex) });
                            } else {
                                beat.push({ duration: "16r", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            }
                            beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex + 1) });
                        } else { //e
                            if (measure[beatIndex] == 1) { //1
                                beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            } else {
                                beat.push({ duration: "16r", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            }
                            beat.push({ duration: "16r", keys: getNotes(beatNotes, measureNotes, beatIndex + 1) }); //e
                        }
                        beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex + 2) }); //&
                    } else {
                        //first beat is a 8th note or rest
                        if (measure[beatIndex + 1] == 1) {

                            if (measure[beatIndex] == 1) {
                                beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            } else {
                                beat.push({ duration: "16r", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            }
                            beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex + 1) });
                        } else {
                            if (measure[beatIndex] == 1) {
                                beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                                beat.push({ duration: "16r", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            } else {
                                beat.push({ duration: "8r", keys: getNotes(beatNotes, measureNotes, beatIndex + 1) });
                            }

                        }
                        beat.push({ duration: "16r", keys: getNotes(beatNotes, measureNotes, beatIndex + 2) });
                    }
                    beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex + 3) });//a
                } else {
                    if (measure[beatIndex + 2] == 1) {

                        if (measure[beatIndex + 1] == 1) {
                            //first beat is a 16th note
                            if (measure[beatIndex] == 1) {
                                beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            } else {
                                beat.push({ duration: "16r" });
                            }
                            beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex + 1) });
                        } else {
                            if (measure[beatIndex] == 1) {
                                beat.push({ duration: "8", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            } else {
                                beat.push({ duration: "8r", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            }
                        }
                        beat.push({ duration: "8", keys: getNotes(beatNotes, measureNotes, beatIndex + 2) });
                    } else {
                        //first beat is a 8th note or rest
                        if (measure[beatIndex + 1] == 1) {

                            if (measure[beatIndex] == 1) {
                                beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            } else {
                                beat.push({ duration: "16r", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            }
                            beat.push({ duration: "16", keys: getNotes(beatNotes, measureNotes, beatIndex + 1) });
                            beat.push({ duration: "8r", keys: getNotes(beatNotes, measureNotes, beatIndex + 2) });
                        } else {
                            if (measure[beatIndex] == 1) {
                                beat.push({ duration: "q", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            } else {
                                beat.push({ duration: "qr", keys: getNotes(beatNotes, measureNotes, beatIndex) });
                            }
                        }
                    }
                }
             
                var beamnotes = [];
                for (j = 0; j < beat.length; j++) {
                    if (beat[j].duration.indexOf("r") > -1) {
                        notes.push(new Vex.Flow.StaveNote({ keys: [restNote], duration: beat[j].duration,stem_direction:direction }));
                    } else {
                        console.log(beat[j].keys);
                        var note = new Vex.Flow.StaveNote({ keys: beat[j].keys, duration: beat[j].duration, stem_direction: direction });
                        notes.push(note);
                        beamnotes.push(note);
                    }
                }
                if (beamnotes.length > 1) {
                    var beam = new Vex.Flow.Beam(beamnotes);
                    beams.push(beam);
                }
            }
            return { beams: beams, notes: notes };
        }
        function TuppleMeasure2(canvas, timesignature, voicenotes) {
            canvas.width = canvas.width;
            var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
            var ctx = renderer.getContext();
            var stave = new Vex.Flow.Stave(10, 0, 350);
            stave.addClef("percussion")
                .addTimeSignature(timesignature.beats + "/" + timesignature.value, 15)
                .setContext(ctx).draw();

            var voices = [];
            var beams = [];
            for (var i = 0; i < voicenotes.length; i++) {
                var voicenote = voicenotes[i];
                var measurenotes = [];
                var notes = [];
                for (j = 0; j < voicenote.lines.length; j++) {
                    measurenotes.push(voicenote.lines[j].notes);
                    notes.push(voicenote.lines[j].note);
                }
                var combineNotes = getBeats(measurenotes, notes, voicenote.restnote, voicenote.direction);
                var voice = new Vex.Flow.Voice({
                    num_beats: timesignature.beats,
                    beat_value: timesignature.value,
                    resolution: Vex.Flow.RESOLUTION
                });
                voice.addTickables([new Vex.Flow.BarNote()]);
                voice.addTickables(combineNotes.notes);
                voices.push(voice);
                tempbeams = combineNotes.beams;
                for (var b = 0; b < tempbeams.length; b++) {
                    beams.push(tempbeams[b]);
                }

            }

            var formatter = new Vex.Flow.Formatter().joinVoices(voices).format(voices, 293);

            for (var k = 0; k < voices.length; k++) {
                voices[k].draw(ctx, stave);
            }
            for (var i = 0; i < beams.length; i++) {
                beams[i].setContext(ctx).draw();
            }

        }

        ko.bindingHandlers.staff = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                $(element).click(function () {
                    var value = ko.unwrap(valueAccessor()) || "";
                    
                    $(element).hide();
                    var table = $('<table></table>').addClass('foo');
                    var row = $('<tr>').append(
                        $('<th></th><th>1</th><th>e</th><th>&</th><th>a</th><th>2</th><th>e</th><th>&</th><th>a</th><th>3</th><th>e</th><th>&</th><th>a</th><th>4</th><th>e</th><th>&</th><th>a</th>')
                    );
                    table.append(row);
                    

                    var row = $('<tr>').addClass('hh');
                    row.append('<td></td>');
                    var values = value.Top[0].notes;
                    for (j = 0; j < 16; j++) {
                        var cell = $('<td><input type="checkbox"' + (values[j] == '1' ? ' checked ' : '') + ' /></td>');
                        row.append(cell);
                    }
                    table.append(row);

                    var row = $('<tr>').addClass('sd');
                    row.append('<td></td>');
                    var values = value.Top[1].notes;
                    for (j = 0; j < 16; j++) {
                        var cell = $('<td><input type="checkbox"'+ (values[j]=='1'? ' checked ' :'') +' /></td>');
                        row.append(cell);
                    }                        
                    table.append(row);

                    var row = $('<tr>').addClass('bd');
                    row.append('<td></td>');
                    var values = value.Bottom[0].notes;
                    for (j = 0; j < 16; j++) {
                        var cell = $('<td><input type="checkbox"' + (values[j] == '1' ? ' checked ' : '') + ' /></td>');
                        row.append(cell);
                    }
                    table.append(row);

                    
                    $(element).parent().append(table);

                    var row = $('<tr>').append(
                        $('<td colspan="17"><button>save</button></td>')
                    );
                    table.append(row);

                    table.find("button").click(function () {                        
                        var value1 = valueAccessor();
                        var valueUnwrapped = ko.unwrap(value1);
                        
                        valueUnwrapped.Top[0].notes = table.find("tr.hh input").map(function () {
                            return this.checked;
                        }).get();
                        valueUnwrapped.Top[1].notes = table.find("tr.sd input").map(function () {
                            return this.checked;
                        }).get();
                        valueUnwrapped.Bottom[0].notes = table.find("tr.bd input").map(function () {
                            return this.checked;
                        }).get();
                        //map the inputs into arrays and update the model.
                        //value1(valueUnwrapped);
                        bindingContext.$parent.Grooves[bindingContext.$index()](valueUnwrapped);
                        //value1(valueUnwrapped);
                        table.hide();
                        $(element).show();
                    });
                });
                // This will be called when the binding is first applied to an element
                // Set up any initial state, event handlers, etc. here
            },
            update: function (element, valueAccessor, allBindings) {
                // First get the latest data that we're bound to
                var value = valueAccessor();

                // Next, whether or not the supplied model property is observable, get its current value
                var valueUnwrapped = ko.unwrap(value);

                var snareNote = "c/5";
                var hhNote = "g/5/x2";
                var kick = "f/4";
                var kickrest = "e/4";
                var commonTime = { beats: 4, value: 4 };
                var voicenotes = [
                    {
                        restnote: snareNote,
                        lines: [{ notes: valueUnwrapped.Top[0].notes, note: hhNote },
                            { notes: valueUnwrapped.Top[1].notes, note: snareNote }
                        ],
                        direction: 1
                    },
                    {
                        restnote: kickrest,
                        lines: [{ notes: valueUnwrapped.Bottom[0].notes, note: kick }
                        ],
                        direction: -1
                    },
                ];


                TuppleMeasure2(element, commonTime, voicenotes);
                // Grab some more data from another binding property
           
            }
        };

        ko.bindingHandlers.htmlValue = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                ko.utils.registerEventHandler(element, "blur", function () {
                    var modelValue = valueAccessor();
                    var elementValue = element.innerHTML;
                    if (ko.isWriteableObservable(modelValue)) {
                        modelValue(elementValue);
                    }
                    else { //handle non-observable one-way binding
                        var allBindings = allBindingsAccessor();
                        if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'].htmlValue) allBindings['_ko_property_writers'].htmlValue(elementValue);
                    }
                });
            },
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor()) || "";
                element.innerHTML = value;
            }
        };



        ko.bindingHandlers.staff = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                $(element).click(function () {
                    var groove = ko.unwrap(valueAccessor()) || "";

                    for (var m = 0; m < groove.measures.length; m++) {
                        var table = $('<table style="display:inline"></table>').addClass('measure').data('measure',m);
                        var measure = groove.measures[m];
                        
                        var row = $('<tr>').append(
                            $('<th></th><th>1</th><th>e</th><th>&</th><th>a</th><th>2</th><th>e</th><th>&</th><th>a</th><th>3</th><th>e</th><th>&</th><th>a</th><th>4</th><th>e</th><th>&</th><th>a</th>')
                        );
                        table.append(row);
                        measure.top.sort(function (a, b) { return b.position - a.position; });
                        var top = measure.top;
                        for (var v = 0; v < top.length; v++) {
                            var voice = top[v];
                            var row = $('<tr>').addClass("position").data("voice", "top").data("index",v);
                            for (var b = 0; b < voice.beats.length; b++) {
                                var beat = voice.beats[b];
                                row.append('<td> </td>');
                                for (var n=0; n < beat.notes.length; n++) {
                                    var note = beat.notes[n];
                                    var cell = $('<td><input type="checkbox"' + (note == '1' ? ' checked ' : '') + ' /></td>');
                                    row.append(cell);
                                }
                            
                            }
                            table.append(row);
                        }
                        measure.bottom.sort(function (a, b) { return b.position - a.position; });
                        var bottom = measure.bottom;
                        for (var v = 0; v < bottom.length; v++) {
                            var voice = bottom[v];
                            var row = $('<tr>').addClass("position").data("voice", "bottom").data("index",v);
                            for (var b = 0; b < voice.beats.length; b++) {
                                var beat = voice.beats[b];
                                row.append('<td> </td>');
                                for (var n = 0; n < beat.notes.length; n++) {
                                    var note = beat.notes[n];
                                    var cell = $('<td><input type="checkbox"' + (note == '1' ? ' checked ' : '') + ' /></td>');
                                    row.append(cell);
                                }

                            }
                            table.append(row);
                        }
                        $(element).parent().append(table);

                        //var row = $('<tr>').append($('<td colspan="17"><button>save</button></td>'));
                        //table.append(row);
                    }

                    $(element).parent().append('<button>save</button>');

                    $(element).parent().find("button").click(function () {
                        var value1 = valueAccessor();
                        var valueUnwrapped = ko.unwrap(value1);

                        $(element).parent().find("table").each(function () {
                            var measure = $(this).data("measure");
                            $(this).find("tr.position").each(function() {
                                var position = $(this).data("voice");
                                var index = $(this).data("index");
                                var voice;
                                if (position == "top") {
                                    voice = valueUnwrapped.measures[measure].top[index];
                                } else {
                                    voice = valueUnwrapped.measures[measure].bottom[index];
                                }
                                var values = $(this).find("input").map(function () { return this.checked; }).get();
                                var z = 0;
                                for (var be = 0; be < 4; be++) {
                                    for (var ne = 0; ne < 4; ne++) {
                                        voice.beats[be].notes[ne] = values[z];
                                        z++;
                                    }
                                }
                            });
                        });
                        value1(valueUnwrapped);
                        //valueUnwrapped.Top[0].notes = table.find("tr.hh input").map(function () {
                        //    return this.checked;
                        //}).get();
                        //valueUnwrapped.Top[1].notes = table.find("tr.sd input").map(function () {
                        //    return this.checked;
                        //}).get();
                        //valueUnwrapped.Bottom[0].notes = table.find("tr.bd input").map(function () {
                        //    return this.checked;
                        //}).get();
                        //map the inputs into arrays and update the model.
                        //value1(valueUnwrapped);
                        //bindingContext.$parent.Grooves[bindingContext.$index()](valueUnwrapped);
                        //value1(valueUnwrapped);
                        //table.hide();
                        $(element).parent().find("table.measure").remove();
                        $(element).parent().find("button").remove();
                        $(element).show();
                    });
                    $(element).hide();
                });
                // This will be called when the binding is first applied to an element
                // Set up any initial state, event handlers, etc. here
            },
            update: function (element, valueAccessor, allBindings) {
                // First get the latest data that we're bound to
                var value = ko.unwrap(valueAccessor());
                draw(element,value);
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


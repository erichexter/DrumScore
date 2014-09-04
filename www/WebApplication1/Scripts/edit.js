
        ko.bindingHandlers.staff = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                $(element).click(function () {
                    var groove = ko.unwrap(valueAccessor()) || "";
                    
                    
                    var table = $('<table></table>').addClass('foo');

                    for (var m = 0; m<groove.measures.length; m++) {
                        var measure = groove.measures[m];
                        
                        var row = $('<tr>').append(
                            $('<th></th><th>1</th><th>e</th><th>&</th><th>a</th><th>2</th><th>e</th><th>&</th><th>a</th><th>3</th><th>e</th><th>&</th><th>a</th><th>4</th><th>e</th><th>&</th><th>a</th>')
                        );
                        table.append(row);
                        for (var v = 0; v < measure.top.length; v++) {
                            var voice = measure.top[v];
                            var row = $('<tr>').addClass('hh');
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

                        for (var v = 0; v < measure.bottom.length; v++) {
                            var voice = measure.bottom[v];
                            var row = $('<tr>').addClass('hh');
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

                    }


                    
                    $(element).parent().append(table);
                    $(element).hide();
                    
                    var row = $('<tr>').append(
                        $('<td colspan="17"><button>save</button></td>')
                    );
                    table.append(row);

                    table.find("button").click(function () {                        
                        var value1 = valueAccessor();
                        var valueUnwrapped = ko.unwrap(value1);
                        
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


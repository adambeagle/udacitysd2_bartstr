var bartService = require('./helpers/bartservice'),
    viewModel = {
      stations: ko.observableArray(),
      originStation: ko.observable(null),
      destStation: null,
      getEtd: function() {
        // TODO
      }
    };

ko.applyBindings(viewModel);
bartService.getStations(viewModel.stations);
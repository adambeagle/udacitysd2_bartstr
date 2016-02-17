(function() {
  var viewModel = {
        stations: ko.observableArray(),
        originStation: ko.observable(null),
        destStation: null,
        getEtd: function() {
          // TODO
        }
      };

  /*
    util closure 
  */
  var util = (function() {
    /* 
    Given an object of parameter names and values, 
    construct a string for use in a URL.

    Example:
      In: {
            name1: 'value1',
            novalue: null,
            name2: 'value2'
      }
      
      Out: '?name1=value1&novalue&name2=value2'
    */
    function toUrlParams(obj) {
      var s = '';
      
      for (var key in obj) {
        var val = obj[key];
        
        if (val !== null)
          s += '&' + key + '=' + val;
        else
          s += '&' + key;
      }
      
      s = '?' + s.slice(1);
      return s;
    }

    return {
      toUrlParams: toUrlParams
    };
  })();
  

  /*
    bart closure
  */
  var bart = (function() {
    var key = CONFIG.keys.bart;

    /* 
      Return full URL for Bart API query.

      'service' is the name of the API service needed, which equates to
      the [NAME] portion of http://api.bart.gov/api/[NAME].aspx?...

      'cmd' is the (always required) 'cmd' parameter to a Bart API call.

      'params' expects an object mapping Url parameter names to values. 
      See toUrlParams() for more help with this object.

      It is not necessary to include the 'key' parameter in 'params; 
      it is always added by this function.

      EXAMPLE:
        buildQuery('route', 'routes', {date:'now'}) 
        -> 'http://api.bart.gov/api/route.aspx?cmd=routes&date=now&key=XXX-XXX'
    */
    function _buildQuery(service, cmd, params) {
      var baseUrl = 'http://api.bart.gov/api/';

      if (!params) {
        params = {};
      }

      params.key = key;
      params.cmd = cmd;

      return baseUrl + service + '.aspx' + util.toUrlParams(params);
    }

    function getStations(stations) {
      $.get(_buildQuery('stn', 'stns'), function(data) {
        data = $(data);

        $('station', data).each(function(i, st) {

          stations.push({
            name: $('name', st).text(),
            abbr: $('abbr', st).text()
          });
        });
      });
    }

    return {
      getStations: getStations
    };
  })();

  ko.applyBindings(viewModel);
  bart.getStations(viewModel.stations);
})();
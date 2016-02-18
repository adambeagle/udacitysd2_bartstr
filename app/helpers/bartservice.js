/*
  bartservice.js

  This module handles bart.gov API calls.
*/

var key = require('../config').keys.bart,
    util = require('./util');

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

/*
  Pushes list of all Bart stations into passed array.

  Station elements are of form {name: 'Full Name', abbr: 'ABBR'}
  Note the values in 'abbr' are used to identify stations across
  other API services.
*/
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

module.exports = {
  getStations: getStations
};

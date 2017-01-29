
var resourcesModule = (function(window, $) {

    /*Global variables within the module scope*/
    var _resources = {
        "autoCompleteFeatures": null
    };
    var _options = {
        "apiURL": "https://data.sfgov.org/resource/cuks-n6tp",
        "appToken": "W4RBmRyo2ORX3liaMhmwRjMHT"
    };
    var _lastAutocompleteQueryTime = moment();

    function _init(callback) {
        //Initialize the module here
        callback.call();
    }

    /**
     * @param {string} query
     */
    function _getDatasetJsonURL(query) {
        return _options["apiURL"] + ".json" + query;
    }

    /**
     * @param {string} query
     */
    function _getCartoDbUrl(query) {
        return "//oneclick.cartodb.com/?file=" + encodeURIComponent(encodeURI(_options["apiURL"] + ".geojson" + query)) + "&provider=DataSF";
    }

    /**
     * @param {string} query
     */
    function _getCsvLink(query) {
        return _options["apiURL"] + ".csv" + query;
    }

    /**
     * @param {string} query
     */
    function _getGeojsonio(query) {
        return "http://geojson.io/#data=data:text/x-url," + encodeURIComponent(_options["apiURL"] + ".geojson" + query);
    }

    function _setEmailLink() {
      var link = encodeURIComponent(encodeURI(location.href));
      return "mailto:?subject=My results from sfcrimedata.org&body=Here is the link to my search: %0A%0A" + link
    }

    /**
     * @param {string} query
     * @param {function} callback
     */
    function _getIncidentsFromAPI(query, callback) {
        var fullURL = _options["apiURL"] + ".geojson" + query;
        $.getJSON(fullURL, callback);
    }

    /**
     * @param {string} inputBit
     * @param {function} callback
     */
    function _getAutoSuggestionsFromService(inputBit, callback) {
        var params = {
            api_key: 'search-kz-89WY',
            text: inputBit,
            'focus.point.lat': 37.76,
            'focus.point.lon': -122.43
        };

        var timeDifference = moment(_lastAutocompleteQueryTime).diff(moment(), "milliseconds") * -1;

        //console.log("Time since the last autocomplete rquest: " + timeDifference);

        if (timeDifference < 150) {
            //console.log("You are typing too fast. Blocking requests.");
            return false;
        }
        _lastAutocompleteQueryTime = moment();

        $.getJSON("//search.mapzen.com/v1/autocomplete", params, function(d) {
            var response = [];
            //Store the latest response from the autocomplete in the module
            _resources["autoCompleteFeatures"] = $.extend({}, d.features);

            $.each(d.features, function(key, val) {
                response.push({
                    "idx": key,
                    "text": val.properties.label
                });
            });

            callback(response);
        });
    }

    /**
     * @param {string} address
     */
    function _getJustAddress(address) {
        var params = {
            api_key: 'search-kz-89WY',
            text: address,
        };

        return $.getJSON("//search.mapzen.com/v1/search", params);
    }

    function _getLatestAutocompleteFeatures() {
        return _resources["autoCompleteFeatures"];
    }


    function _reverseGeocoding(coordinates, callback) {
        var params = {access_token: mapModule.getMapboxAccessToken()};
        $.getJSON("//api.mapbox.com/v4/geocode/mapbox.places/" + coordinates[0] + "," + coordinates[1] + ".json.json", params, callback);
    }

    return {
        init: _init,
        getAutoSuggestionsFromService: _getAutoSuggestionsFromService,
        getJustAddress: _getJustAddress,
        getLatestAutocompleteFeatures: _getLatestAutocompleteFeatures,
        getIncidentsFromAPI: _getIncidentsFromAPI,
        getCsvLink: _getCsvLink,
        getCartoDbUrl: _getCartoDbUrl,
        getGeojsonio: _getGeojsonio,
        getDatasetJsonURL: _getDatasetJsonURL,
        reverseGeocoding: _reverseGeocoding,
        setEmailLink: _setEmailLink
    }
})(window, jQuery);


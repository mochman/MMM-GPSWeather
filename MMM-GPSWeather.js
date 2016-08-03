/* global Module */

/* Magic Mirror v0.1
 * Module: MMM-GPSWeather
 * MIT Licensed
 * By Luke Moch
 */

Module.register("MMM-GPSWeather",{

	// Default module config.
	defaults: {
		locationAPIKey: "",
		locationOnly: false,
		username: "",
		latlonUrlBase: "",
		fileLocation: "/here.php",
		nameUrlBase: "https://maps.googleapis.com/maps/api/geocode/json?latlng=",
		updateInterval: 60 * 60 * 1000, // 1 hour wait time between weather grabs, because who needs up to the minute forecasts or location changes?
		animationSpeed: 2000,
		WUAPIKey: "",
		units: config.units,
		maxNumberOfDays: 7,
		timeFormat: config.timeFormat,
		lang: config.language,
		fade: true,
		degreeSym: true,
		pop: true,
		iconSet: "k",
		fadePoint: 0.25, // Start on 1/4th of the list.

		initialLoadDelay: 2500, // 2.5 seconds delay. This delay is used to keep the wunderground API happy.
		retryDelay: 2500,

		apiBase: "http://api.wunderground.com/api/",
		forecastEndpoint: "/forecast10day/q/",

                iconTable: {
                        "chanceflurries": "wi-day-snow-wind",
                        "chancerain": "wi-day-showers",
                        "chancesleet": "wi-day-sleet",
                        "chancesnow": "wi-day-snow",
                        "chancetstorms": "wi-day-storm-showers",
                        "clear": "wi-day-sunny",
                        "cloudy": "wi-cloud",
                        "flurries": "wi-snow-wind",
                        "fog": "wi-fog",
                        "haze": "wi-day-haze",
                        "mostlycloudy": "wi-cloudy",
                        "mostlysunny": "wi-day-sunny-overcast",
                        "partlycloudy": "wi-day-cloudy",
                        "partlysunny": "wi-day-cloudy-high",
			"rain": "wi-rain",
                        "sleet": "wi-sleet",
                        "snow": "wi-snow",
                        "tstorms": "wi-thunderstorm"
                },
	},
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required scripts.
	getStyles: function() {
		return ["MMM-GPSWeather.css", "weather-icons.css"];
	},

	// Define required translations.
	getTranslations: function() {
		// The translations for the defaut modules are defined in the core translation files.
		// Therefor we can just return false. Otherwise we should have returned a dictionary.
		// If you're trying to build your own module including translations, check out the documentation.
		return false;
	},

	start: function() {
		Log.info("Starting module: " + this.name);

		this.varLat = null;
		this.varLon = null;
		this.varTime = "";
		this.friendlyName = null;
		this.errorData = null;

		// Set locale.
		moment.locale(this.config.lang);

		this.forecast = [];
		this.loaded = false;
		this.loadingVar = null;

		//Run the updater function with a delay from the config to start getting data to display
		this.scheduleUpdate(this.config.initialLoadDelay);
		this.iconText = null;
		this.retry = true;
		this.degSymbol = null;


	},

	// Override dom generator.
	getDom: function() {
		var text = "<h1>" + this.config.username + "'s in ";

		var wrapper = document.createElement("div");

		if (this.errorData !== null) {
			console.log("Error - " + this.errorData);
			wrapper.innerHTML = this.errorData;
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (this.config.WUAPIKey === "") {
			wrapper.innerHTML = "Please set the correct wunderground <i>WUAPIKey</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (this.config.locationAPIKey === "") {
			wrapper.innerHTML = "Please set the correct google <i>locationAPIKey</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.loaded) {
			if (this.loadingVar !== null) {
				wrapper.innerHTML = this.loadingVar;
				wrapper.className = "dimmed light small";
				return wrapper;
			}
			wrapper.innerHTML = "Loading Lat/Long Data...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var header = text + this.friendlyName + "</h1>";

		var headerTable = document.createElement("span");
		headerTable.innerHTML = header + this.varTime + "<hr>";

		wrapper.appendChild(headerTable);


			var table = document.createElement("table");
			table.className = "small";
if(this.config.locationOnly === false) {

			for (var f in this.forecast) {
				var forecast = this.forecast[f];
				var row = document.createElement("tr");
				table.classname = "row";
				table.appendChild(row);

				var dayCell = document.createElement("td");
				dayCell.className = "day";
				dayCell.innerHTML = forecast.day;
				row.appendChild(dayCell);

        var popCell = document.createElement("td");
				popCell.className = "align-right pop";
        if (forecast.pop > 0 && this.config.pop) {
        	popCell.innerHTML = "  <sup>" + forecast.pop + "%</sup>";
        }
        row.appendChild(popCell);

				var iconCell = document.createElement("td");
				iconCell.className = "align-center bright weather-icon";
				row.appendChild(iconCell);

				var icon = document.createElement("span");
				icon.className = forecast.icon;
				iconCell.appendChild(icon);

				// Set the degree symbol if desired
				if (this.config.degreeSym) {
					degSymbol = "&deg;";
				}

				var maxTempCell = document.createElement("td");
				if (this.config.units === "imperial") {
					maxTempCell.innerHTML = forecast.maxTemp + degSymbol;
				} else if (this.config.units === "metric") {
					maxTempCell.innerHTML = forecast.maxTempC + degSymbol;
				} else {
					maxTempCell.innerHTML = forecast.maxTempC + 273 + degSymbol;
				}
				maxTempCell.className = "align-right bright max-temp";
				row.appendChild(maxTempCell);

				var minTempCell = document.createElement("td");
        	if (this.config.units === "imperial") {
          	minTempCell.innerHTML = forecast.minTemp + degSymbol;
          } else if (this.config.units === "metric") {
          	minTempCell.innerHTML = forecast.minTempC  + degSymbol;
          } else {
          	minTempCell.innerHTML = forecast.minTempC + 273 + degSymbol;
          }
				minTempCell.className = "align-right min-temp";
				row.appendChild(minTempCell);

				if (this.config.fade && this.config.fadePoint < 1) {
					if (this.config.fadePoint < 0) {
						this.config.fadePoint = 0;
					}
					var startingPoint = this.forecast.length * this.config.fadePoint;
					var steps = this.forecast.length - startingPoint;
					if (f >= startingPoint) {
						var currentStep = f - startingPoint;
						row.style.opacity = 1 - (1 / steps * currentStep);
					}
				}

			}
		}
		wrapper.appendChild(table);

		return wrapper;
	},

//WEATHER SECTION
//---------------------------------------------------------------------------------------------------------------------------
	updateWeather: function() {
		var url = this.config.apiBase + this.config.WUAPIKey + this.config.forecastEndpoint + this.varLat + "," + this.varLon + ".json";
		var self = this;
		var weatherRequest = new XMLHttpRequest();
		weatherRequest.open("GET", url, true);
		weatherRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					try {
						var parsed = JSON.parse(this.response);
					}catch(e){
						console.log("weatherforecast - JSON error: " + e.name);
						self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
						return;
					}
					self.processWeather(parsed);
				} else if (this.status === 0) {
					self.config.WUAPIKey = "";
					self.updateDom(self.config.animationSpeed);
					console.log(self.name + ": Incorrect Wunderground APPID.");
					self.retry = false;
				} else {
					console.log(self.name + ": Could not load weather.");
				}

				if (self.retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		weatherRequest.send();
	},

	/* processWeather(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - Weather information received form wunderground.
	 */
	processWeather: function(data) {

		this.forecast = [];
		try{

			for (var i = 0, count = Math.min(data.forecast.simpleforecast.forecastday.length, this.config.maxNumberOfDays); i < count; i++) {

				var forecast = data.forecast.simpleforecast.forecastday[i];
				this.forecast.push({

					day: moment(forecast.date.epoch, "X").format("ddd"),
//							icon: forecast.icon_url,
					icon: this.config.iconTable[forecast.icon],
					pop: forecast.pop,
					maxTemp: this.roundValue(forecast.high.fahrenheit),
					minTemp: this.roundValue(forecast.low.fahrenheit),
					maxTempC: this.roundValue(forecast.high.celsius),
					minTempC: this.roundValue(forecast.low.celsius)

				});
			}
		}catch(e){
		  console.log(this.name + ": Could not load weather from lat/lon");
		}

		this.loadingVar = null;
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

	roundValue: function(temperature) {
		return Math.round(temperature);
	},
//--------------------------------------------------------------------------------------------------------------------------------------------
// Location Section
//--------------------------------------------------------------------------------------------------------------------------------------------
	getLocation: function() {
		// Uses URL scheme of "http://yourserver.com/gpsUSERNAME/here.php".  Modify as needed for your server.
		// Allows for multiple folders for different people.  I'm using that function when I switch between mirror users.
		var url = this.config.latlongUrlBase + this.config.username + this.config.fileLocation;
		var self = this;

		var locationRequest = new XMLHttpRequest();

		locationRequest.open("GET", url, true);

		locationRequest.onreadystatechange = function() {
			if (locationRequest.readyState === 4) {
				if (locationRequest.status === 200) {
					//If you receive a valid response from the server put the lat/long in variables.
					self.processLocation(JSON.parse(locationRequest.response));
					//Start to find the City/State info
					self.locationName();

				} else if (locationRequest.status === 0 ) {
					Log.error(self.name + ": Could not get valid JSON Lat/Long data from " + this.config.latlongUrlBase);
					self.config.errorData = "Could not get valid JSON Lat/Long data from " + this.config.latlongUrlBase;
					self.updateDom(self.config.animationSpeed);
				} else {
					Log.error(self.name + ": Some problem with getting Lat/Long.");
					self.config.errorData = "Some problem with getting Lat/Long";
					self.updateDom(self.config.animationSpeed);
				}
			}
		};
		locationRequest.send();

	},

	locationName: function() {
		var self = this;
		var nameURL = self.config.nameUrlBase + self.varLat + "," + self.varLon + "&key=" + self.config.locationAPIKey;


		var nameRequest = new XMLHttpRequest();
		nameRequest.open("GET", nameURL, true);
		nameRequest.onreadystatechange = function () {
			if (nameRequest.readyState === 4) {
				if (nameRequest.status === 200) {
					self.processName(JSON.parse(nameRequest.response));
					if (self.errorData === null) {
						self.updateWeather();
					}

				} else {
					Log.error(self.name + ": Some problem with getting City/State.");
					self.config.errorData = "Some problem with getting City/State";
					self.updateDom(self.config.animationSpeed);
				}
			  }
		};
		nameRequest.send();
	},

	processLocation: function(data) {
		this.varLat = this.roundValue2(data.lat);
		this.varLon = this.roundValue2(data.lon);
		if (data.time !== "undefined") {
			this.varTime = this.calcTime(data.time);
		}
		this.loadingVar = "Got Lat/Long, waiting for City/State...";
		this.updateDom(this.config.animationSpeed);
	},

	calcTime: function(timeIn) {
		var returnTime = "<p>";
		var timeNow = new Date().getTime();
		if(timeIn > timeNow) {
			diffTime = timeIn - timeNow;
		} else {
			diffTime = timeNow - timeIn;
		}
		var diffTimeDays = diffTime / 24 / 60 / 60 / 1000;
		var diffTimeHours = (diffTimeDays % 1) * 24;
		var diffTimeMin = (diffTimeHours % 1) * 60;
		if (diffTimeDays >= 1) {
			returnTime += "As of " + (diffTimeDays - (diffTimeDays % 1));
			returnTime += (diffTimeDays - (diffTimeDays % 1)) == 1 ? " day ago" : " days ago</p>";
		} else if (diffTimeHours >= 1) {
			returnTime += "As of " + (diffTimeHours - (diffTimeHours % 1));
			returnTime += (diffTimeHours - (diffTimeHours %1)) == 1  ? " hour ago" : " hours ago</p>";
		} else {
			returnTime += "As of " + (diffTimeMin - (diffTimeMin % 1));
			returnTime += (diffTimeMin - (diffTimeMin %1)) == 1  ? " minute ago" : " minutes ago</p>";
		}
		return returnTime;
	},

	processName: function(data) {
		if (data.status === "REQUEST_DENIED" ) {
			if (data.error_message === "The provided API key is invalid." ) {
				this.config.locationAPIKey = "";
				this.retry = false;
			} else {
				this.errorData = "There was an issue with google providing you data";
			}
		} else {
			this.friendlyName = data.results[0].address_components[2].long_name + ", " + data.results[0].address_components[4].short_name;
			this.loadingVar = "Got City/State waiting for weather...";
		}
		this.updateDom(this.config.animationSpeed);
	},
//--------------------------------------------------------------------------------------------------------------------------------------------


	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		//if a valid delay > 0 was passed into the function use that for the delay
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.getLocation();
		}, nextLoad);
	},

	roundValue2: function(position) {
		return parseFloat(position).toFixed(4);
	}

});

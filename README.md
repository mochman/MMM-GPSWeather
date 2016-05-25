# Module: MMM-GPSWeather
The `MMM-GPSWeather` module is an addon.
This module outputs the last location of a user who's updated a specific website.
Uses a modified version of <a href="https://github.com/herverenault/Self-Hosted-GPS-Tracker">Hervé Renault's Self Hosted GPS Tracker</a>
The modified files are located in the <a href="./server-files">server-files</a> folder

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-GPSWeather',
		position: 'bottom_left',	// This can be any of the regions.
									// Best results in one of the side regions like: bottom_left
		config: {
			// See 'Configuration options' for more information.
			locationAPIKey: '1234567890zbcdefghijkl' //google maps API key - REQUIRED
			username: 'MyName' // Part of the position URL
			latlonUrlBase: "http://yourserver.net/gps", //The server you have your GPS file hosted - REQUIRED
			WUAPIKey: '12391290348sjdf834' // Wunderground API Key - REQUIRED

		}
	}
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>username</code></td>
			<td>The username used for URL differentiation and display.<br>
				<br><b>Example:</b> <code>JohnR</code>
				<br> This value is <b>REQUIRED</b>
			</td>
		</tr>
		<tr>
			<td><code>locationAPIKey</code></td>
			<td>The <a href="https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding" target="_blank">Google's</a> API key, which can be obtained by creating google account.<br>
				<br> This value is <b>REQUIRED</b>
			</td>
		</tr>
		<tr>
			<td><code>fileLocation</code></td>
			<td>The JSON data page for your GPS data<br>
				<br><b>Example:</b> <code>here.php</code>
			</td>
		</tr>
		<tr>
			<td><code>WUAPIKey</code></td>
			<td>The <a href="https://www.wunderground.com/weather/api/d/pricing" target="_blank">Wunderground.com's</a> API key, which can be obtained by creating a free Cumulus plan.<br>
				<br> This value is <b>REQUIRED</b>
			</td>
		</tr>
		<tr>
			<td><code>latlonUrlBase</code></td>
			<td>The server where your gps file is stored<br>
				<br><b>Example:</b> <code>http://www.myserver.com/gps</code>
				<br> This value is <b>REQUIRED</b>
			</td>
		</tr>
		<tr>
			<td><code>nameUrlBase</code></td>
			<td>Google's Geooding API URL<br>
				<br><b>Default Value:</b> <code>"https://maps.googleapis.com/maps/api/geocode/json?latlng="</code>
			</td>
		</tr>
		<tr>
			<td><code>apiBase</code></td>
			<td>Wunderground's API URL<br>
				<br><b>Default Value:</b> <code>"http://api.wunderground.com/api/"</code>
			</td>
		</tr>
		<tr>
			<td><code>forecastEndpoint</code></td>
			<td>Wunderground's API URL<br>
				<br><b>Default Value:</b> <code>"/forecast10day/q/"</code>
			</td>
		</tr>	
		<tr>
			<td><code>updateInterval</code></td>
			<td>How often does the content needs to be fetched? (Milliseconds)<br>
				<br><b>Possible values:</b> <code>1000</code> - <code>86400000</code>
				<br><b>Default value:</b> <code>3600000</code> (1 hour)
			</td>
		</tr>
		<tr>
			<td><code>animationSpeed</code></td>
			<td>Speed of the update animation. (Milliseconds)<br>
				<br><b>Possible values:</b><code>0</code> - <code>5000</code>
				<br><b>Default value:</b> <code>2000</code> (2 seconds)
			</td>
		</tr>
		<tr>
			<td><code>initialLoadDelay</code></td>
			<td>The initial delay before loading. If you have multiple modules that use the same API key, you might want to delay one of the requests. (Milliseconds)<br>
				<br><b>Possible values:</b> <code>1000</code> - <code>5000</code>
				<br><b>Default value:</b>  <code>2500</code> (2.5 seconds)
			</td>
		</tr>
		<tr>
			<td><code>retryDelay</code></td>
			<td>Time between retries if one of the pages doesn't load correctly (Milliseconds)<br>
				<br><b>Possible values:</b> <code>1000</code> - <code>5000</code>
				<br><b>Default value:</b>  <code>2500</code> (2.5 seconds)
			</td>
		</tr>
		<tr>
			<td><code>Units</code></td>
			<td>Override Config Units<br>
				<br><b>Default value:</b>  <code>From Config</code>
			</td>
		</tr>
	</tbody>
</table>
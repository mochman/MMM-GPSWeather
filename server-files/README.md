Put these files on your server and create a folder called "tmp". <br>
Make sure that the folder is writeable.<br>
<br>
gps.php is the URL to point <a href="https://play.google.com/store/apps/details?id=fr.herverenault.selfhostedgpstracker">Hervé Renault's GPS Tracker</a> (for android) to.<br>
here.php is the JSON lat/long output of the location that will be stored by gps.php. <br>
<br>
Important: if your Apache server is not configured with Multiviews enabled, you have to add ".php" into the files.
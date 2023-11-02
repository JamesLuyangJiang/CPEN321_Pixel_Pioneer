package com.example.mvp01;

import static android.icu.lang.UProperty.MATH;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.widget.ImageView;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.sql.Array;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;


public class MainActivity extends AppCompatActivity implements LocationListener {

    private ExecutorService executorService;

    private int CANVAS_WIDTH = 1024;
    private int CANVAS_HEIGHT = 1024;
    private static final double EPSILON = 10e-7;
    private static final double NORTH_POLE = 90.0;
    private static final int PERMISSIONS_REQUEST_CODE = 100;
    private LocationManager locationManager;

    private double locationLat = 49.246292;
    private double locationLong = -123.116226;

    private String responseREL = "189";
    private String responseRightAsc = "1424";

    final static String TAG = "yingqi01";

    private int SKYMAP_WIDTH = 2587;
    private int SKYMAP_HEIGHT = 1284;
    private String response;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

//        SimpleDateFormat time = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
//        String currentTime = time.format(new Date());
//
//        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
//        String currentDate = date.format(new Date());
//
//        Log.d(TAG, currentTime);
//        Log.d(TAG, currentDate);

        @SuppressLint({"MissingInflatedId", "LocalSuppress"}) TextView Location = (TextView)findViewById(R.id.textView);
        Location.setText(responseREL);

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION}, 225);
            return;
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1, 0, this);


        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 0, this);

        //  Setting up the bitmap images

//        executorService = Executors.newSingleThreadExecutor();
//
//        // Execute the network request in a background thread
//        Future<String> result = executorService.submit(() -> {
//            // Make your network request here
//            String response = makeHttpGetRequest("https://example.com");
//            return response;
//        });
//
//        ImageView image;
//        Bitmap skymapRaw, canvas;
//
//        image = (ImageView) findViewById(R.id.imageView);
//
//        skymapRaw = BitmapFactory.decodeResource(getResources(), R.drawable.starc);
//        skymapRaw = skymapRaw.copy( Bitmap.Config.ARGB_8888 , true);
//
//        canvas = BitmapFactory.decodeResource(getResources(), R.drawable.canvas1024);
//        canvas = canvas.copy( Bitmap.Config.ARGB_8888 , true);
//
//        CANVAS_WIDTH = canvas.getWidth();
//        CANVAS_HEIGHT = canvas.getHeight();
//
//        SKYMAP_WIDTH = skymapRaw.getWidth();
//        SKYMAP_HEIGHT = skymapRaw.getHeight();
//
//        //Invoke the API to get the necessary information
//
//
//
//        // Build and display the skyMap
//        buildSkyMap(canvas, skymapRaw, 321, 50, 0);
//
//        image.setImageBitmap(canvas);
    }

    /*
     * This code is based on the answer by user3732887
     * on the post https://stackoverflow.com/questions/41441906/how-to-get-a-users-current-city
     * */
    @Override
    public void onLocationChanged(@NonNull Location location) {

        long timestamp = 0;

        SimpleDateFormat time = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
        String formattedDate = time.format(new Date());

        timestamp = Integer.valueOf(formattedDate.substring(0, 2)) * 3600
                + Integer.valueOf(formattedDate.substring(3, 5)) * 60
                + Integer.valueOf(formattedDate.substring(6, 8));


        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        String currentDate = date.format(new Date());

        Log.d(TAG, String.valueOf(timestamp) + "timestamp");
        Log.d(TAG, currentDate);

        double lat = location.getLatitude();
        double lon = location.getLongitude();

        locationLat = lat;
        locationLong = lon;

        Log.d(TAG, String.valueOf(locationLat) + " latitude");
        Log.d(TAG, String.valueOf(locationLong) + " longitude");

        double temp_long = -123.116226;
        double temp_lat = 49.246292;

        executorService = Executors.newSingleThreadExecutor();

        // Execute the network request in a background thread
        Future<String> result = executorService.submit(() -> {
            // Make your network request here
            response = makeHttpGetRequest(currentDate, locationLat, locationLong);
            return response;
        });

//        String resultString;
//
//        try {
//            resultString = result.get();
//            Log.d(TAG, result.get());
//        } catch (ExecutionException e) {
//            throw new RuntimeException(e);
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }

        int hour = Integer.valueOf(responseRightAsc.substring(0, 2));
        int min = Integer.valueOf(responseRightAsc.substring(2, 4));

        int curDegree = Integer.valueOf(responseREL);

        double rightAscentionOffset = ((hour - 12.0)/ 24.0 + min / (60.0 * 24.0)) * 360;


        ImageView image;
        Bitmap skymapRaw, canvas;

        image = (ImageView) findViewById(R.id.imageView);

        skymapRaw = BitmapFactory.decodeResource(getResources(), R.drawable.starc);
        skymapRaw = skymapRaw.copy( Bitmap.Config.ARGB_8888 , true);

        canvas = BitmapFactory.decodeResource(getResources(), R.drawable.canvas1024);
        canvas = canvas.copy( Bitmap.Config.ARGB_8888 , true);

        CANVAS_WIDTH = canvas.getWidth();
        CANVAS_HEIGHT = canvas.getHeight();

        SKYMAP_WIDTH = skymapRaw.getWidth();
        SKYMAP_HEIGHT = skymapRaw.getHeight();

        //Invoke the API to get the necessary information

        // Build and display the skyMap
        double timeOffset = 2 * Math.PI * (timestamp - (13.0 * 3600.0 + 30.0 * 60.0)) / ((24. * 3600.0));
        buildSkyMap(canvas, skymapRaw, curDegree, rightAscentionOffset, locationLat, timeOffset);

        @SuppressLint({"MissingInflatedId", "LocalSuppress"}) TextView Location = (TextView)findViewById(R.id.textView);
        Location.setText(responseREL);
        image.setImageBitmap(canvas);

        return;
    }
    void buildSkyMap(Bitmap canvas, Bitmap skymapRaw, double curDegree, double rightAscentionOffset, double locationLat, double timeOffset){

        for(int i = 0; i < CANVAS_WIDTH; i++){
            for(int j = 0; j < CANVAS_HEIGHT; j++){

                double relativeX = 2 * (i - CANVAS_WIDTH * 0.5) / CANVAS_WIDTH;
                double relativeY = 2 * (j - CANVAS_HEIGHT * 0.5) / CANVAS_HEIGHT;

                double r = Math.sqrt(relativeX * relativeX + relativeY * relativeY);

                if(r > 1.00){
                    continue;
                }

                double theta, phi;

                if(relativeX > 0){
                    theta = Math.atan(relativeY / (relativeX + EPSILON));
                } else{
                    theta = Math.atan(relativeY / (relativeX + EPSILON)) + Math.PI;
                }

                phi = Math.PI * r / 2.0;

                double[] offsetArr = calculateOffset(curDegree, rightAscentionOffset, locationLat, timeOffset);
                double offsetX = offsetArr[0];
                double offsetY = offsetArr[1];

                double[] rotationArr = rotationY(theta, phi, offsetX, offsetY);

                double rotatedTheta = rotationArr[0];
                double rotatedPhi = rotationArr[1];

                int color = getAtlasGlobe(rotatedTheta, rotatedPhi, skymapRaw);
                canvas.setPixel(i, j, color);
            }
        }
    }

    double[] rotationY(double theta, double phi, double offsetX, double offsetY){

        double xEucl, yEucl, zEucl, xTransformedEucl, yTransformedEucl, zTransformedEucl;
        double cosineThetaRot, rho;
        double thetaRot, phiRot;

        xEucl = Math.sin(phi) * Math.cos(theta);
        yEucl = Math.sin(phi) * Math.sin(theta);
        zEucl = Math.cos(phi);

        xTransformedEucl = Math.cos(offsetY) * xEucl + Math.sin(offsetY) * zEucl;
        yTransformedEucl = yEucl;
        zTransformedEucl = (-1.0) * Math.sin(offsetY) * xEucl + Math.cos(offsetY) * zEucl;

        rho = Math.sqrt(xTransformedEucl * xTransformedEucl
                + yTransformedEucl * yTransformedEucl
                + zTransformedEucl * zTransformedEucl);

        phiRot = Math.acos(zTransformedEucl / (rho + EPSILON));

        cosineThetaRot = xTransformedEucl / (Math.sin(phiRot) + EPSILON);

        if(yTransformedEucl > 0) {
            thetaRot = Math.acos(cosineThetaRot) + offsetX;
        }else{
            thetaRot = -Math.acos(cosineThetaRot) + offsetX;
        }

        double[] arr = {thetaRot, phiRot};

        return arr;
    }

    int getAtlasGlobe(double theta, double phi, Bitmap skymapRaw){

        int xRelative = (int) (SKYMAP_WIDTH * ((-theta) / (2 * 3.1415926535) + 3));
        int xPos = xRelative % SKYMAP_WIDTH;

        int yRelative = (int) (SKYMAP_HEIGHT * phi / Math.PI);
        int yPos = yRelative % SKYMAP_HEIGHT;

        return skymapRaw.getPixel(xPos, yPos);
    }

    double[] calculateOffset(double curDegree, double rightAscentionOffset, double locationLat, double timeOffset){
        double offsetX = (curDegree + rightAscentionOffset) * 2 * Math.PI / 360 + timeOffset;
        double offsetY = (NORTH_POLE - locationLat) * 2 * Math.PI / 360;

        //Log.d(TAG, String.valueOf(offsetX) + " offsetX");

        return new double[]{offsetX, offsetY};
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Shutdown the executor when it's no longer needed to release resources
        if (executorService != null) {
            executorService.shutdown();
        }
    }

    public String makeHttpGetRequest(String currentDate, double lat, double lon) {

        try {
            //Log.d(TAG, "arrived here0");
            URL url1 = new URL("https://aa.usno.navy.mil/calculated/positions/topocentric?ID=AA&task=8&body=10&date=" +
                    currentDate +
                    "&time=02%3A30%3A14.000&intv_mag=1.00&intv_unit=1&reps=1&lat=0.0000&lon=0.0000&label=&height=0&submit=Get+Data");
            URL url = new URL("https://aa.usno.navy.mil/calculated/altaz?body=10&date=" +
                    currentDate +
                    "&intv_mag=30&lat=" +
                    String.valueOf(lat) +
                    "&lon=" +
                    String.valueOf(lon) +
                    "&label=Vancouver&tz=0.00&tz_sign=-1&submit=Get+Data");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            HttpURLConnection connection1 = (HttpURLConnection) url1.openConnection();

            // Set up the connection for a GET request
            connection.setRequestMethod("GET");
            connection.setReadTimeout(10000);
            connection.setConnectTimeout(15000);

            connection1.setRequestMethod("GET");
            connection1.setReadTimeout(10000);
            connection1.setConnectTimeout(15000);

            //String applicationId = "497dfbce-92d7-4e84-9c4b-69684d17c0de";
            //String applicationSecret = "6118116600f140a23ad267038948036dc0977186fd68341acf14824cc0ff1525df947c6f97cc9698a7b0267ee0c93a448a997587063b4b68f7d603e91674ff00b01e10ec02c6d099144dc9f7027885255435e01cf0bb9ac531219f0a71f0747ba7fb08c64eaae24d69f698f1dc784333";

            // Combine applicationId and applicationSecret with a colon
            //String credentials = applicationId + ":" + applicationSecret;
            //Log.d(TAG, "arrived here3");
            // Encode the credentials to base64
            //String authString = Base64.getEncoder().encodeToString(credentials.getBytes());
            //Log.d(TAG, "arrived here4");
            // Set a custom header (e.g., an Authorization header)
            // connection.setRequestProperty("Authorization", "Basic " + authString);
            connection.connect();
            connection1.connect();

            //Log.d(TAG, "arrived here5");
            // Get the response
            int responseCode = connection.getResponseCode();
            int responseCode1 = connection1.getResponseCode();
            //Log.d(TAG, "arrived here");

            if (responseCode == HttpURLConnection.HTTP_OK) {
                //Log.d(TAG, "arrived here1");
                InputStream is = connection.getInputStream();
                BufferedReader br = new BufferedReader(new InputStreamReader(is));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                br.close();
                responseREL = sb.toString().replaceAll("[a-zA-Z\\s<>/=\"]", "").substring(599, 603).replaceAll("\\..*$", "").replaceAll("°", "");
                Log.d(TAG, "result: " + responseREL);
            }else{
                Log.d(TAG, "Failed to get any response!" + responseCode);
            }

            if (responseCode1 == HttpURLConnection.HTTP_OK) {
                //Log.d(TAG, "arrived here11");
                InputStream is = connection1.getInputStream();
                BufferedReader br = new BufferedReader(new InputStreamReader(is));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                br.close();
                responseRightAsc = sb.toString().replaceAll("[a-zA-Z\\s<>]", "").substring(859, 863);
                Log.d(TAG, "result1: " + responseRightAsc);
            }else{
                Log.d(TAG, "Failed to get any response!" + responseCode);
            }

            connection.disconnect();
        } catch (IOException e) {

            e.printStackTrace();
        }

        return responseREL + responseRightAsc;
    }

    private boolean checkLocationPermission() {
        String permission = android.Manifest.permission.ACCESS_FINE_LOCATION;
        return ActivityCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestLocationPermission() {
        String[] permissions = {android.Manifest.permission.ACCESS_FINE_LOCATION};
        ActivityCompat.requestPermissions(this, permissions, PERMISSIONS_REQUEST_CODE);
    }

    private void accessLocation() {
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            Location lastKnownLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

            if (lastKnownLocation != null) {
                double latitude = lastKnownLocation.getLatitude();
                double longitude = lastKnownLocation.getLongitude();
                Log.d(TAG, String.valueOf(latitude) + "latitude");
            } else {
                Log.d(TAG, "Location not available");
            }
        }
    }
}
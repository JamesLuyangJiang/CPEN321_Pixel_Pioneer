package com.example.m4_mvp.ui.stars;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.example.m4_mvp.databinding.FragmentStarsBinding;
import com.example.m4_mvp.R;

import java.io.InputStream;
import java.net.HttpURLConnection;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;

public class StarsFragment extends Fragment {
    final static String TAG = "StarsFragment";
    private FragmentStarsBinding binding;

    private ExecutorService executorService;

    private int CANVAS_WIDTH = 1024;
    private int CANVAS_HEIGHT = 1024;
    private static final double EPSILON = 10e-7;
    private static final double NORTH_POLE = 90.0;
    private static final int PERMISSIONS_REQUEST_CODE = 100;
    private LocationManager locationManager;
    private StarsLocationListener locationListener;

    private double locationLat = 49.246292;
    private double locationLong = -123.116226;

    private String responseREL = "189";
    private String responseRightAsc = "1424";

    private int SKYMAP_WIDTH = 2587;
    private int SKYMAP_HEIGHT = 1284;
    private String response;

    private ImageView starImage;

    // ChatGPT usage: Partial
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentStarsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        starImage = root.findViewById(R.id.imageView);

        locationManager = (LocationManager) requireActivity().getSystemService(Context.LOCATION_SERVICE);
        locationListener = new StarsLocationListener();

        if (ContextCompat.checkSelfPermission(requireContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(requireContext(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION}, 225);
        } else {
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1, 0, locationListener);
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 0, locationListener);
        }

        return root;
    }

    // ChatGPT usage: No
    void buildSkyMap(Bitmap canvas, Bitmap skymapRaw, double curDegree, double rightAscentionOffset, double locationLat, double timeOffset) {
        for (int i = 0; i < CANVAS_WIDTH; i++) {
            for (int j = 0; j < CANVAS_HEIGHT; j++) {

                double relativeX = 2 * (i - CANVAS_WIDTH * 0.5) / CANVAS_WIDTH;
                double relativeY = 2 * (j - CANVAS_HEIGHT * 0.5) / CANVAS_HEIGHT;

                double r = Math.sqrt(relativeX * relativeX + relativeY * relativeY);

                if (r > 1.00) {
                    continue;
                }

                double theta, phi;

                if (relativeX > 0) {
                    theta = Math.atan(relativeY / (relativeX + EPSILON));
                } else {
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

    // ChatGPT usage: No
    double[] rotationY(double theta, double phi, double offsetX, double offsetY) {
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

        if (yTransformedEucl > 0) {
            thetaRot = Math.acos(cosineThetaRot) + offsetX;
        } else {
            thetaRot = -Math.acos(cosineThetaRot) + offsetX;
        }

        double[] arr = {thetaRot, phiRot};

        return arr;
    }

    // ChatGPT usage: No
    int getAtlasGlobe(double theta, double phi, @NonNull Bitmap skymapRaw) {
        int xRelative = (int) (SKYMAP_WIDTH * ((-theta) / (2 * 3.1415926535) + 3));
        int xPos = xRelative % SKYMAP_WIDTH;

        int yRelative = (int) (SKYMAP_HEIGHT * phi / Math.PI);
        int yPos = yRelative % SKYMAP_HEIGHT;

        return skymapRaw.getPixel(xPos, yPos);
    }

    // ChatGPT usage: No
    double[] calculateOffset(double curDegree, double rightAscentionOffset, double locationLat, double timeOffset) {
        double offsetX = (curDegree + rightAscentionOffset) * 2 * Math.PI / 360 + timeOffset;
        double offsetY = (NORTH_POLE - locationLat) * 2 * Math.PI / 360;

        //Log.d(TAG, String.valueOf(offsetX) + " offsetX");

        return new double[]{offsetX, offsetY};
    }

    // ChatGPT usage: Yes
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
            } else {
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
            } else {
                Log.d(TAG, "Failed to get any response!" + responseCode);
            }

            connection.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return responseREL + responseRightAsc;
    }

    // ChatGPT usage: Partial
    private class StarsLocationListener implements LocationListener {
        /*
         * This code is based on the answer by user3732887
         * on the post https://stackoverflow.com/questions/41441906/how-to-get-a-users-current-city
         * */
        @Override
        public void onLocationChanged(Location location) {
            long timestamp;

            SimpleDateFormat time = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
            String formattedDate = time.format(new Date());

            timestamp = Integer.valueOf(formattedDate.substring(0, 2)) * 3600
                    + Integer.valueOf(formattedDate.substring(3, 5)) * 60
                    + Integer.valueOf(formattedDate.substring(6, 8));

            SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            String currentDate = date.format(new Date());

            Log.d(TAG, timestamp + "timestamp");
            Log.d(TAG, currentDate);

            double lat = location.getLatitude();
            double lon = location.getLongitude();

            locationLat = lat;
            locationLong = lon;

            Log.d(TAG, locationLat + " latitude");
            Log.d(TAG, locationLong + " longitude");

            double temp_long = -123.116226;
            double temp_lat = 49.246292;

            executorService = Executors.newSingleThreadExecutor();

            // Execute the network request in a background thread
            Future<String> result = executorService.submit(() -> {
                response = makeHttpGetRequest(currentDate, locationLat, locationLong);
                return response;
            });

            int hour = Integer.valueOf(responseRightAsc.substring(0, 2));
            int min = Integer.valueOf(responseRightAsc.substring(2, 4));

            int curDegree = Integer.valueOf(responseREL);

            double rightAscentionOffset = ((hour - 12.0) / 24.0 + min / (60.0 * 24.0)) * 360;

            // Update the star chart
            ImageView image;
            Bitmap skymapRaw, canvas;

            image = starImage;

            skymapRaw = BitmapFactory.decodeResource(getResources(), R.drawable.starc);
            skymapRaw = skymapRaw.copy(Bitmap.Config.ARGB_8888, true);

            canvas = BitmapFactory.decodeResource(getResources(), R.drawable.canvas1024);
            canvas = canvas.copy(Bitmap.Config.ARGB_8888, true);

            CANVAS_WIDTH = canvas.getWidth();
            CANVAS_HEIGHT = canvas.getHeight();

            SKYMAP_WIDTH = skymapRaw.getWidth();
            SKYMAP_HEIGHT = skymapRaw.getHeight();

            // TODO: Remove this comment if not needed
            //Invoke the API to get the necessary information

            // Build and display the skyMap
            double timeOffset = 2 * Math.PI * (timestamp - (13.0 * 3600.0 + 30.0 * 60.0)) / ((24. * 3600.0));
            buildSkyMap(canvas, skymapRaw, curDegree, rightAscentionOffset, locationLat, timeOffset);

            image.setImageBitmap(canvas);
        }
    }

    // ChatGPT usage: No
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    // ChatGPT usage: Partial
    @Override
    public void onDestroy() {
        super.onDestroy();

        if (executorService != null) {
            executorService.shutdown();
        }
    }
}
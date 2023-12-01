package com.example.m4_mvp.ui.stars;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.example.m4_mvp.databinding.FragmentStarsBinding;
import com.example.m4_mvp.R;

import java.io.InputStream;
import java.net.HttpURLConnection;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.concurrent.Future;

public class StarsFragment extends Fragment {
    final static String TAG = "StarsFragment";

    public double diff = 0;

    public double diff1 = 0;
    public double diff2 = 0;
    public double diff3 = 0;

    public double offsetOfX = 0;
    public double offsetOfY = 0;

    private FragmentStarsBinding binding;

    private ExecutorService executorService;

    private int CANVAS_WIDTH = 1024;
    private int CANVAS_HEIGHT = 1024;
    private static final double EPSILON = 10e-7;
    private static final double NORTH_POLE = 90.0;

    private double locationLat = 49.246292;
    private double locationLong = -123.116226;

    private double curLocationLat = 49.246292;
    private double curLocationLong = -123.116226;

    private String responseREL = "189";
    private String responseRightAsc = "1424";

    private int SKYMAP_WIDTH = 2587;
    private int SKYMAP_HEIGHT = 1284;
    private String response;
    private Future<String> networkTaskResult;

    private StarsLocationListener locationListener;
    private LocationManager locationManager;

    private ImageView starImage;

    private View ROOT;

    private int MULTIPLIER = 1;

    private long DISPLAY_TIMESTAMP;
    private long CURRENT_TIMESTAMP;

    private int SPEED_UP = 0;

    private int UPDATE_INTERVAL = 500;
    private int GPS_UPDATE_INTERVAL = 30000;

    private int CUSTOM_LOCATION = 0;

    private int TRANSPARENT = 0x0;
    private CountDownTimer countDownTimer;

    // ChatGPT usage: Partial
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        Log.i(TAG, "onCreateView: ");
        binding = FragmentStarsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();
        ROOT = root;

        Animation fadeInAnimation = AnimationUtils.loadAnimation(requireContext(), R.anim.fragment_fade_in);
        root.startAnimation(fadeInAnimation);

        starImage = root.findViewById(R.id.imageView);

        TextView displayedLocation = (TextView) root.findViewById(R.id.starsFrequency);
        displayedLocation.setText("Display Location: ");

        List<String> spinnerArray = new ArrayList<String>();
        spinnerArray.add("Current Location");
        spinnerArray.add("Vancouver");
        spinnerArray.add("Montreal");
        spinnerArray.add("Paris");
        spinnerArray.add("Melbourne");
        spinnerArray.add("Tokyo");

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(root.getContext(), android.R.layout.simple_spinner_item, spinnerArray);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        Spinner spinner = (Spinner) root.findViewById(R.id.spinner);
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {

            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view,
                                       int position, long id) {
                switch(position){
                    case 0:
                        CUSTOM_LOCATION = 0;
                        locationLat = curLocationLat;
                        locationLong = curLocationLong;
                        //displayedLocation.setText("Star Chart Displays: Current Location");
                        break;

                    case 1:
                        CUSTOM_LOCATION = 1;
                        locationLat = 49.2827;
                        locationLong = -123.1207;
                        //displayedLocation.setText("Star Chart Displays: Vancouver");
                        break;

                    case 2:
                        CUSTOM_LOCATION = 1;
                        locationLat = 45.5019;
                        locationLong = -73.5674;
                        //displayedLocation.setText("Star Chart Displays: Montreal");
                        break;

                    case 3:
                        CUSTOM_LOCATION = 1;
                        locationLat = 48.8566;
                        locationLong = 2.3522;
                        //displayedLocation.setText("Star Chart Displays: Paris");
                        break;

                    case 4:
                        CUSTOM_LOCATION = 1;
                        locationLat = -37.8136;
                        locationLong = 144.9631;
                        //displayedLocation.setText("Star Chart Displays: Melbourne");
                        break;

                    case 5:
                        CUSTOM_LOCATION = 1;
                        locationLat = 35.6764;
                        locationLong = 139.6500;
                        //displayedLocation.setText("Star Chart Displays: Tokyo");
                        break;

                    default:
                        CUSTOM_LOCATION = 0;
                        locationLat = curLocationLat;
                        locationLong = curLocationLong;
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
                Log.d("Codacy", "onNothingSelected: ");
            }
        });

        long timestamp;

        SimpleDateFormat time = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
        String formattedDate = time.format(new Date());

        timestamp = 1000 * (Integer.valueOf(formattedDate.substring(0, 2)) * 3600
                + Integer.valueOf(formattedDate.substring(3, 5)) * 60
                + Integer.valueOf(formattedDate.substring(6, 8)) );

        CURRENT_TIMESTAMP = timestamp;
        DISPLAY_TIMESTAMP = timestamp;

        TextView displayedTime = (TextView) root.findViewById(R.id.starsHeading);
        displayedTime.setText("Star Chart Displays: Current Time");

        Button forward = (Button) root.findViewById(R.id.forwards);
        forward.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.i(TAG, "onClick forward: ");

                SPEED_UP = 1;

                switch(MULTIPLIER){

                    case -1200:
                        MULTIPLIER = -600;
                        break;

                    case -600:
                        MULTIPLIER = -300;
                        break;

                    case -300:
                        MULTIPLIER = -100;
                        break;

                    case -100:
                        MULTIPLIER = -10;
                        break;

                    case -10:
                        MULTIPLIER = 1;
                        break;

                    case 1:
                        MULTIPLIER = 10;
                        break;

                    case 10:
                        MULTIPLIER = 100;
                        break;

                    case 100:
                        MULTIPLIER = 300;
                        break;

                    case 300:
                        MULTIPLIER = 600;
                        break;

                    case 600:
                        MULTIPLIER = 1200;
                        break;

                    default:
                        MULTIPLIER = MULTIPLIER;
                }
            }
        });

        Button backward = (Button) root.findViewById(R.id.backwards);
        backward.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                SPEED_UP = 1;

                switch(MULTIPLIER){

                    case -600:
                        MULTIPLIER = -1200;
                        break;

                    case -300:
                        MULTIPLIER = -600;
                        break;

                    case -100:
                        MULTIPLIER = -300;
                        break;

                    case -10:
                        MULTIPLIER = -100;
                        break;

                    case -1:
                        MULTIPLIER = -10;
                        break;

                    case 1:
                        MULTIPLIER = -1;
                        break;

                    case 10:
                        MULTIPLIER = 1;
                        break;

                    case 100:
                        MULTIPLIER = 10;
                        break;

                    case 300:
                        MULTIPLIER = 100;
                        break;

                    case 600:
                        MULTIPLIER = 300;
                        break;

                    case 1200:
                        MULTIPLIER = 600;
                        break;

                    default:
                        MULTIPLIER = MULTIPLIER;
                }
            }
        });

        Button reset = (Button) root.findViewById(R.id.reset);
        reset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SPEED_UP = 0;
                MULTIPLIER = 1;
            }
        });

        //    private static final int PERMISSIONS_REQUEST_CODE = 100;
        locationManager = (LocationManager) requireActivity().getSystemService(Context.LOCATION_SERVICE);
        locationListener = new StarsLocationListener();

        if (ContextCompat.checkSelfPermission(requireContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(requireContext(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION}, 225);
        } else {
            locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, GPS_UPDATE_INTERVAL, 0, locationListener);
            //locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 0, locationListener);
        }

        countDownTimer = new CountDownTimer(6000000, UPDATE_INTERVAL) {
            public void onTick(long millisUntilFinished) {
                // For every second, do something.
                initialize();
            }

            public void onFinish() {
                Log.d("Codacy", "onNothingSelected: "); // restart again.
            }
        };

        countDownTimer.start();

        return root;
    }

    // ChatGPT usage: No
    void buildSkyMap(Bitmap canvas, Bitmap skymapRaw, double curDegree, double rightAscentionOffset, double locationLat, double timeOffset) {

        Log.i(TAG, "buildSkyMap: ");
        int updateDiffFlag = 1;

        for (int i = 0; i < CANVAS_WIDTH; i++) {
            for (int j = 0; j < CANVAS_HEIGHT; j++) {

                double relativeX = 2 * (i - CANVAS_WIDTH * 0.5) / CANVAS_WIDTH;
                double relativeY = 2 * (j - CANVAS_HEIGHT * 0.5) / CANVAS_HEIGHT;

                double r = Math.sqrt(relativeX * relativeX + relativeY * relativeY);

                double theta,
                       phi;

                if (relativeX > 0) {
                    theta = Math.atan(relativeY / (relativeX + EPSILON));
                } else {
                    theta = Math.atan(relativeY / (relativeX + EPSILON)) + Math.PI;
                }

                phi = Math.PI * r / 2.0;

                double[] offsetArr = calculateOffset(curDegree, rightAscentionOffset, locationLat, timeOffset);

                double offsetX = offsetArr[0];
                double offsetY = offsetArr[1];

                if((updateDiffFlag == 1) && (offsetOfX != 0) && (offsetOfY != 0)){

//                    Log.d("DIFF", String.valueOf(diff));

                    double diffRaw = Math.abs(offsetX - offsetOfX) + Math.abs(offsetY - offsetOfY);
                    diff = diffRaw / (2*Math.PI) * 86400;

                    diff1 = diff2;
                    diff2 = diff3;
                    diff3 = diff;

                    TextView testDiff = getView().findViewById(R.id.testDiff);
                    testDiff.setText(String.valueOf(Math.max(Math.max(diff1, diff2), diff3)));

                    updateDiffFlag = 0;
                }

                offsetOfX = offsetX;
                offsetOfY = offsetY;

                double[] rotationArr = rotationY(theta, phi, offsetX, offsetY);

                double rotatedTheta = rotationArr[0];
                double rotatedPhi = rotationArr[1];

                int color = getAtlasGlobe(rotatedTheta, rotatedPhi, skymapRaw);

                if (r > 1.00) {
                    int red = (color >> 8) & 0xff;
                    int green = (color >> 16) & 0xff;
                    int blue = (color >> 0) & 0xff;

                    red = red / 2;
                    green = green / 2;
                    blue = blue / 2;

//                    color = alpha + (red << 8) + (green << 16) + (blue);
                    color = TRANSPARENT;
                }

                canvas.setPixel(i, j, color);
            }
        }
    }

    public double getDiff(){
        return diff;
    }

    // ChatGPT usage: No
    double[] rotationY(double theta, double phi, double offsetX, double offsetY) {
        double xEucl,
               yEucl,
               zEucl,
               xTransformedEucl,
               yTransformedEucl,
               zTransformedEucl;

        double cosineThetaRot,
               rho;

        double thetaRot,
               phiRot;

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
                responseREL = sb.toString().replaceAll("[a-zA-Z\\s<>/=\"]", "").substring(599, 603).replaceAll("\\..*$", "").replaceAll("°", "").replaceAll("[^0-9]", "");
//                Log.d(TAG, "result: " + responseREL);
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
                responseRightAsc = sb.toString().replaceAll("[a-zA-Z\\s<>]", "").substring(859, 863).replaceAll("[^0-9]", "");
//                Log.d(TAG, "result1: " + responseRightAsc);
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
        // ChatGPT usage: Partial
        /*
         * This code is based on the answer by user3732887
         * on the post https://stackoverflow.com/questions/41441906/how-to-get-a-users-current-city
         * */
        @SuppressLint("SetTextI18n")
        @Override
        public void onLocationChanged(Location location) {
            double lat = location.getLatitude();
            double lon = location.getLongitude();

            if(CUSTOM_LOCATION == 0){
                locationLat = lat;
                locationLong = lon;
            }

            curLocationLat = lat;
            curLocationLong = lon;
        }
    }

    @SuppressLint("SetTextI18n")
    private void initialize(){
            long timestamp;

            SimpleDateFormat time = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
            String formattedDate = time.format(new Date());

            timestamp = 1000 * (Integer.valueOf(formattedDate.substring(0, 2)) * 3600
                    + Integer.valueOf(formattedDate.substring(3, 5)) * 60
                    + Integer.valueOf(formattedDate.substring(6, 8)) );


            CURRENT_TIMESTAMP = timestamp;

            if(SPEED_UP == 0){
                DISPLAY_TIMESTAMP = CURRENT_TIMESTAMP;
            }
            else{
                DISPLAY_TIMESTAMP += (long) MULTIPLIER * UPDATE_INTERVAL;
            }

            long display_in_seconds = (long) Math.floorMod((long)(DISPLAY_TIMESTAMP / 1000), (long) (24*60*60));
            //long display_in_seconds = (DISPLAY_TIMESTAMP / 1000);

            TextView displayedTime = (TextView) ROOT.findViewById(R.id.starsHeading);
            displayedTime.setText("Star Chart At Time " + String.valueOf(display_in_seconds / 3600) + " : "
                    + String.valueOf(Math.floorMod(display_in_seconds / 60, (long) 60)) + " : "
                    + String.valueOf(Math.floorMod(display_in_seconds, (long) 60)));

            SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            String currentDate = date.format(new Date());

//            Log.d(TAG, timestamp + "timestamp");
//            Log.d(TAG, currentDate);

            // Log.d(TAG, locationLat + " latitude");
            // Log.d(TAG, locationLong + " longitude");

            executorService = Executors.newSingleThreadExecutor();

            // Execute the network request in a background thread
            networkTaskResult = executorService.submit(() -> {
                response = makeHttpGetRequest(currentDate, locationLat, locationLong);
                return response;
            });

            int hour = Integer.valueOf(responseRightAsc.substring(0, 2));
            int min = Integer.valueOf(responseRightAsc.substring(2, 4));

            int curDegree = Integer.valueOf(responseREL);

            double rightAscentionOffset = ((hour - 12.0) / 24.0 + min / (60.0 * 24.0)) * 360;

            // Update the star chart
            ImageView image;
            Bitmap skymapRaw,
                   canvas;

            image = starImage;

            skymapRaw = BitmapFactory.decodeResource(requireActivity().getResources(), R.drawable.starc);
            skymapRaw = skymapRaw.copy(Bitmap.Config.ARGB_8888, true);

            canvas = BitmapFactory.decodeResource(requireActivity().getResources(), R.drawable.canvas1024);
            canvas = canvas.copy(Bitmap.Config.ARGB_8888, true);

            CANVAS_WIDTH = canvas.getWidth();
            CANVAS_HEIGHT = canvas.getHeight();

            SKYMAP_WIDTH = skymapRaw.getWidth();
            SKYMAP_HEIGHT = skymapRaw.getHeight();

            // TODO: Remove this comment if not needed
            //Invoke the API to get the necessary information

            // Build and display the skyMap
            double timeOffset = 2 * Math.PI * (Math.floorMod((int) display_in_seconds, (int) (24 * 3600)) - (13.0 * 3600.0 + 30.0 * 60.0)) / ((24.0 * 3600.0));
            buildSkyMap(canvas, skymapRaw, curDegree, rightAscentionOffset, locationLat, timeOffset);

            image.setImageBitmap(canvas);
    }

    // ChatGPT usage: Partial
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;

        // Unregister listeners
        if (locationManager != null && locationListener != null) {
            Log.d(TAG, "onDestroyView: listener removed");
            locationManager.removeUpdates(locationListener);
        }

        if (countDownTimer != null) {
            Log.i(TAG, "onDestroyView: counter cancelled");
            countDownTimer.cancel();
        }
    }

    // ChatGPT usage: Yes
    @Override
    public void onDestroy() {
        super.onDestroy();

        if (networkTaskResult != null && !networkTaskResult.isDone()) {
            networkTaskResult.cancel(true);
        }

        executorService.shutdownNow();
    }
}
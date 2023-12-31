package com.example.m4_mvp;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Toast;
import android.os.Handler;

import com.example.m4_mvp.databinding.ActivityMainBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.google.firebase.messaging.FirebaseMessaging;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

public class MainActivity extends AppCompatActivity {
    final static String TAG = "MainActivity";

    private ProfileViewModel profileViewModel;

    // ChatGPT usage: No
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getPermissions();
    }

    // ChatGPT usage: No
    private void getPermissions() {
        // Check if we have WIFI and location permissions
        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // If no, request for it
            ActivityCompat.requestPermissions(this, new String[] {android.Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION}, 1);
        } else {
            displayUI();
        }
    }

    // ChatGPT usage: No
    // Source: https://stackoverflow.com/questions/50067149/start-a-fragment-from-upon-getting-permission
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1) {
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                    && ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                displayUI();
            } else {
                Toast.makeText(MainActivity.this, "Location permission required!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    // ChatGPT usage: Yes
    private void displayUI() {
        profileViewModel = new ViewModelProvider(this).get(ProfileViewModel.class);
        profileViewModel.initGoogleAccount(MainActivity.this);

        SharedPreferences sharedPreferences = getSharedPreferences("uid", Context.MODE_PRIVATE);
        profileViewModel.setSharedPreferences(sharedPreferences);

        if (profileViewModel.getMaxDistance() == -1) {
            profileViewModel.setMaxDistance(getResources().getString(R.string.defaultDistance));
        }

        Log.d(TAG, "uid signed in: " + sharedPreferences.getString("uid", null));

        ActivityMainBinding binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        BottomNavigationView navView = findViewById(R.id.nav_view);
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.stars_fragment, R.id.recommend_fragment, R.id.events_fragment, R.id.profile_fragment, R.id.signin_fragment)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_activity_main);
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(binding.navView, navController);

        navView.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.navigation_recommend:
                        if (profileViewModel.getGoogleAccount() == null) {
                            // Sign in page
                            navController.navigate(R.id.signin_fragment);
                            navView.post(() -> {
                                navView.setSelectedItemId(R.id.navigation_profile);
                                Toast.makeText(getApplicationContext(), "Please sign in!", Toast.LENGTH_SHORT).show();
                            });
                        } else {
                            navController.navigate(R.id.recommend_fragment);
                        }
                        return true;
                    case R.id.navigation_events:
                        if (profileViewModel.getGoogleAccount() == null) {
                            // Sign in page
                            navController.navigate(R.id.signin_fragment);
                            navView.post(() -> {
                                navView.setSelectedItemId(R.id.navigation_profile);
                                Toast.makeText(getApplicationContext(), "Please sign in!", Toast.LENGTH_SHORT).show();
                            });
                        } else {
                            navController.navigate(R.id.events_fragment);
                        }
                        return true;
                    case R.id.navigation_profile:
                        if (profileViewModel.getGoogleAccount() == null) {
                            // Sign in page
                            navController.navigate(R.id.signin_fragment);
                        } else {
                            // Profile page
                            navController.navigate(R.id.profile_fragment);
                        }
                        return true;
                    default:
                        navController.navigate(R.id.stars_fragment);
                        return true;
                }
            }
        });

        fetchToken();
    }

    // ChatGPT usage: Partial
    private void fetchToken() {
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "Fetching FCM registration token failed", task.getException());

                            // Try fetching from FCM again since it is usually FCM issue
                            new Handler().postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    fetchToken(); // Retry the token retrieval
                                }
                            }, 500);
                        }

                        // Get new FCM registration token
                        String token = task.getResult();

                        profileViewModel.setToken(token);

                        // Log and toast
                        Log.d(TAG, "firebase token: " + token);
//                        Toast.makeText(MainActivity.this, token, Toast.LENGTH_SHORT).show();
                    }
                });
    }
}
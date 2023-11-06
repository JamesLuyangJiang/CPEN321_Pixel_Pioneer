package com.example.m4_mvp.ui.profile;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.m4_mvp.ProfileViewModel;
import com.example.m4_mvp.R;
import com.example.m4_mvp.databinding.FragmentProfileBinding;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ProfileFragment extends Fragment {
    final static String TAG = "ProfileFragment";

    private ProfileViewModel profileViewModel;

    private View profileView;
    private ExecutorService executorService = Executors.newSingleThreadExecutor();

    // ChatGPT usage: Partial
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        profileViewModel = new ViewModelProvider(requireActivity()).get(ProfileViewModel.class);
    }

    // ChatGPT usage: Partial
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Get the data binding and view
        FragmentProfileBinding binding = FragmentProfileBinding.inflate(inflater, container, false);
        View root = binding.getRoot();
        profileView = root;

        EditText maxDistance =  root.findViewById(R.id.maxDistInput);
        maxDistance.setText(String.valueOf(profileViewModel.getMaxDistance()));

        // Inflate the layout for this fragment
        return root;
    }

    // ChatGPT usage: Partial
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Log.d(TAG, "current max distance: " + profileViewModel.getMaxDistance());

        TextView email = view.findViewById(R.id.emailAddress);
        email.setText(profileViewModel.getGoogleAccount().getEmail());

        view.findViewById(R.id.updateProfileButton).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Update Profile!");
                Future<String> networkTaskResult;

                networkTaskResult = executorService.submit(() -> {
                    try {
                        URL url = new URL(getResources().getString(R.string.profile_url) + "/update/" + profileViewModel.getuid());
                        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                        // Set up the connection for a DELETE request
                        connection.setRequestMethod("PUT");
                        connection.setReadTimeout(10000);
                        connection.setConnectTimeout(15000);

                        // Set the request body
                        connection.setDoOutput(true);

                        EditText inputDistance = profileView.findViewById(R.id.maxDistInput);

                        if (inputDistance.getText().toString().equals("") || Integer.parseInt(inputDistance.getText().toString()) > 1000 || Integer.parseInt(inputDistance.getText().toString()) < 50) {
                            Log.d(TAG, "onClick: " + inputDistance.getText().toString());
                            return "rangeError";
                        }

                        String requestBody = "{\"email\": \"" + profileViewModel.getGoogleAccount().getEmail() +
                                "\", \"distance\": \"" + inputDistance.getText().toString() + "\", \"notificationToken\": \"" + profileViewModel.getToken() + "\"}";

                        // Set up the request body
                        byte[] requestBytes = requestBody.getBytes("UTF-8");
                        connection.setRequestProperty("Content-Type", "application/json");
                        connection.setRequestProperty("Content-Length", String.valueOf(requestBytes.length));

                        // Write the JSON data to the connection
                        OutputStream out = connection.getOutputStream();
                        out.write(requestBytes);
                        out.close();

                        // Get the response code
                        int responseCode = connection.getResponseCode();

                        if (responseCode == HttpURLConnection.HTTP_OK) {
                            Log.d(TAG, "profile updated");

                            // On success, update profileViewModel
                            if (inputDistance.getText() != null) {
                                profileViewModel.setMaxDistance(inputDistance.getText().toString());
                            }
                        } else {
                            Log.d(TAG, "profile update failed with response code: " + responseCode);
                        }

                        connection.disconnect();
                        return null;
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                });

                try {
                    String updateResult = networkTaskResult.get();

                    if (updateResult == "rangeError") {
                        Toast.makeText(requireActivity(), "Please enter a number in the range above!", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(requireActivity(), "Profile updated!", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    Log.d(TAG, "profile update failed with error: " + e);
                }
            }
        });
    }
}
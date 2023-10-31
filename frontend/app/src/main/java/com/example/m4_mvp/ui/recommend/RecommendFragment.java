package com.example.m4_mvp.ui.recommend;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.NumberPicker;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.ViewModelProvider;

import com.example.m4_mvp.R;
import com.example.m4_mvp.databinding.FragmentRecommendBinding;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class RecommendFragment extends Fragment {
    final static String TAG = "RecommendFragment";

    private FragmentRecommendBinding binding;
    private Button recommendButton;
    private NumberPicker datePicker;
    private ExecutorService executorService = Executors.newSingleThreadExecutor();
    private Future<String> networkTaskResult;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        // Get the data binding and view
        binding = FragmentRecommendBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Set up date picker
        datePicker = binding.datePicker;
        datePicker.setMinValue(1);
        datePicker.setMaxValue(7);
        datePicker.setValue(1);
        datePicker.setWrapSelectorWheel(false);

        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Button for submitting user inputs and redirect to new fragment
        recommendButton = view.findViewById(R.id.recommendButton);
        recommendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // TODO: check the star is available or not

                // Start the fragment transaction to loading page
                LoadingFragment loadingFragment = new LoadingFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();

                // Replace the current fragment with the loading fragment
                transaction.replace(R.id.nav_host_fragment_activity_main, loadingFragment);

                // Add the transaction to the stack in case I want to go back when error occurs
                transaction.addToBackStack(null);

                // Go to the loading fragment
                transaction.commit();

                // Make an https post request to server
                networkTaskResult = executorService.submit(() -> {
                    try {
                        // set up https connection
                        String response;
                        URL url = new URL(getResources().getString(R.string.url));
                        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                        // Configure the connection
                        connection.setRequestMethod("GET");
                        connection.setReadTimeout(10000);
                        connection.setConnectTimeout(15000);
                        connection.connect();

                        int responseCode = connection.getResponseCode();

                        if (responseCode == HttpURLConnection.HTTP_OK) {
                            // Read the response
                            InputStream is = connection.getInputStream();
                            BufferedReader br = new BufferedReader(new InputStreamReader(is));
                            StringBuilder sb = new StringBuilder();
                            String line;
                            while ((line = br.readLine()) != null) {
                                sb.append(line);
                            }
                            br.close();
                            response = sb.toString();

                            // Go to the final fragment for displaying the results
                            ResultsFragment resultsFragment = ResultsFragment.newInstance(response);
                            FragmentTransaction responseTransaction = getParentFragmentManager().beginTransaction();

                            responseTransaction.replace(R.id.nav_host_fragment_activity_main, resultsFragment);
                            responseTransaction.addToBackStack(null);
                            responseTransaction.commit();
                        } else {
                            Log.d(TAG, "onError: " + responseCode);
                        }

                        connection.disconnect();

                        return null;

                    } catch (IOException e) {
                        // TODO: handle exception here
                        Log.d(TAG, "onException: " + e);
                        return null;
                    }
                });
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (networkTaskResult != null && !networkTaskResult.isDone()) {
            networkTaskResult.cancel(true);
        }
        executorService.shutdownNow();
    }
}
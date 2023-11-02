package com.example.m4_mvp.ui.recommend;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.m4_mvp.ProfileViewModel;
import com.example.m4_mvp.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ResultsFragment extends Fragment {
    final static String TAG = "ResultsFragment";

    private List<List<String>> recResponse = new ArrayList<>();
    private ProfileViewModel profileViewModel;

    private ExecutorService executorService = Executors.newSingleThreadExecutor();
    private Future<String> networkTaskResult;

    public static ResultsFragment newInstance(String response) {
        ResultsFragment fragment = new ResultsFragment();
        Bundle args = new Bundle();
        args.putString("recResponse", response);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        profileViewModel = new ViewModelProvider(requireActivity()).get(ProfileViewModel.class);

        if (getArguments() != null) {
            String jsonString = getArguments().getString("recResponse");

            // Parse the JSON string
            try {
                JSONArray jsonArray = new JSONArray(jsonString);

                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);

                    List<String> innerList = new ArrayList<>();
                    innerList.add(jsonObject.getString("name"));
                    innerList.add(jsonObject.getString("distance") + "KM");
                    innerList.add(jsonObject.getString("date"));

                    recResponse.add(innerList);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_results, container, false);
        RecyclerView recyclerView = root.findViewById(R.id.recRecyclerView);

        // TODO: remove this list for testing
        // List<List<String>> dataList = Arrays.asList(Arrays.asList("Van", "10", "2023-10-30"), Arrays.asList("Edmonton", "20", "2023-11-01"));
        String recButtonText = "Select";
        View.OnClickListener recButtonListener = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = recyclerView.getChildAdapterPosition((View) v.getParent());
                List<String> eventData = recResponse.get(position);

                // Make an https post request for creating a new event
                networkTaskResult = executorService.submit(() -> {
                    try {
                        // set up https connection
                        String response;
                        URL url = new URL(getResources().getString(R.string.events_url) + "/" + profileViewModel.getuid() + "/events");
                        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                        // Configure the connection
                        connection.setRequestMethod("POST");
                        connection.setReadTimeout(10000);
                        connection.setConnectTimeout(15000);
                        connection.setDoOutput(true);

                        // Set up the JSON object
                        String jsonString = "{\"name\": \"" + eventData.get(0) +
                                "\", \"date\": \"" + eventData.get(2) + "\", \"notificationToken\": \"" + profileViewModel.getToken() + "\"}";

                        // Set up the request body
                        byte[] requestBytes = jsonString.getBytes("UTF-8");
                        connection.setRequestProperty("Content-Type", "application/json");
                        connection.setRequestProperty("Content-Length", String.valueOf(requestBytes.length));

                        // Write the JSON data to the connection
                        OutputStream out = connection.getOutputStream();
                        out.write(requestBytes);
                        out.close();

                        int responseCode = connection.getResponseCode();

                        if (responseCode == HttpURLConnection.HTTP_OK) {
                            Log.d(TAG, "event created");
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
        };
        RecyclerAdapter adapter = new RecyclerAdapter(recResponse, recButtonText, recButtonListener);

        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        // Inflate the layout for this fragment
        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Log.d(TAG, "onViewCreated: " + recResponse);
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
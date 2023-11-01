package com.example.m4_mvp.ui.events;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.m4_mvp.ProfileViewModel;
import com.example.m4_mvp.R;
import com.example.m4_mvp.databinding.FragmentEventsBinding;
import com.example.m4_mvp.ui.recommend.RecyclerAdapter;
import com.example.m4_mvp.ui.recommend.ResultsFragment;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class EventsFragment extends Fragment {
    final static String TAG = "EventsFragment";

    private FragmentEventsBinding binding;
    private RecyclerAdapter adapter;

    private ExecutorService executorService = Executors.newSingleThreadExecutor();
    private Future<String> networkTaskResult;
    private List<List<String>> eventsResponse = new ArrayList<>();

    private ProfileViewModel profileViewModel;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        profileViewModel = new ViewModelProvider(requireActivity()).get(ProfileViewModel.class);
    }

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        // TODO: remove this if necessary
        EventsViewModel eventsViewModel =
                new ViewModelProvider(this).get(EventsViewModel.class);

        binding = FragmentEventsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        RecyclerView recyclerView = root.findViewById(R.id.eventsRecyclerView);
        // TODO: remove this list for testing
        // List<List<String>> dataList = Arrays.asList(Arrays.asList("Van", "10", "2023-10-30"), Arrays.asList("Edmonton", "20", "2023-11-01"));
        String eventsButtonText = "Cancel";
        View.OnClickListener eventsButtonListener = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // TODO: Define the button click action for canceling an event
                int position = recyclerView.getChildAdapterPosition((View) v.getParent()); // Get item position
                List<String> eventData = eventsResponse.get(position);
                Log.d(TAG, "onClick: " + eventData);
            }
        };
        List<List<String>> emptyList = new ArrayList<>();
        adapter = new RecyclerAdapter(emptyList, eventsButtonText, eventsButtonListener);

        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        showLoading(root);
        makeRequest(root);

        return root;
    }

    private void showLoading( View view) {
        // Hide the recycler view
        RecyclerView recyclerView = view.findViewById(R.id.eventsRecyclerView);
        recyclerView.setVisibility(View.INVISIBLE);

        // Show the loading page first
        ProgressBar progressBar = view.findViewById(R.id.eventsProgressBar);
        TextView loadingText = view.findViewById(R.id.eventsLoadingText);
        progressBar.setVisibility(View.VISIBLE);
        loadingText.setVisibility(View.VISIBLE);
    }

    private void makeRequest(View view) {
        // Make an https GET request to server
        networkTaskResult = executorService.submit(() -> {
            try {
                // set up https connection
                String response;
                Log.d(TAG, "id: " + profileViewModel.getuid());
                URL url = new URL(getResources().getString(R.string.events_url) + "/" + profileViewModel.getuid() + "/events");
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

                    Log.d(TAG, "responseString: " + response);

                    onResponse(response, view);
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

    private void onResponse(String jsonString, View view) {
        // Case for no events found
        if (Objects.equals(jsonString, "[]")) {
            Log.d(TAG, "no events UI");

            requireActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    // Hide the loading page
                    ProgressBar progressBar = view.findViewById(R.id.eventsProgressBar);
                    progressBar.setVisibility(View.INVISIBLE);

                    TextView loadingText = view.findViewById(R.id.eventsLoadingText);
                    loadingText.setVisibility(View.INVISIBLE);

                    // Show the no events message
                    TextView noEventsTitle = view.findViewById(R.id.noEventsTitle);
                    noEventsTitle.setVisibility(View.VISIBLE);

                    Log.d(TAG, "finish updating UI");
                }
            });
            return;
        }

        // Parse the JSON string
        try {
            JSONArray jsonArray = new JSONArray(jsonString);

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);

                List<String> innerList = new ArrayList<>();
                innerList.add(jsonObject.getString("name"));
                innerList.add(jsonObject.getString("date"));

                eventsResponse.add(innerList);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        requireActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                adapter.changeData(eventsResponse);

                // Hide the loading page
                ProgressBar progressBar = view.findViewById(R.id.eventsProgressBar);
                progressBar.setVisibility(View.INVISIBLE);

                TextView loadingText = view.findViewById(R.id.eventsLoadingText);
                loadingText.setVisibility(View.INVISIBLE);

                // Show the recycler view
                RecyclerView recyclerView = view.findViewById(R.id.eventsRecyclerView);
                recyclerView.setVisibility(View.VISIBLE);

                Log.d(TAG, "finish updating UI");
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
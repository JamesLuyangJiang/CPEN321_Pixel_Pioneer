package com.example.m4_mvp.ui.events;

import android.app.AlertDialog;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.m4_mvp.ProfileViewModel;
import com.example.m4_mvp.R;
import com.example.m4_mvp.databinding.FragmentEventsBinding;

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
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class EventsFragment extends Fragment {
    final static String TAG = "EventsFragment";

    private FragmentEventsBinding binding;
    private EventsRecyclerAdapter adapter;

    private ExecutorService executorService = Executors.newSingleThreadExecutor();
    private Future<String> networkTaskResult;
    private List<List<String>> eventsResponse = new ArrayList<>();

    private ProfileViewModel profileViewModel;

    // ChatGPT usage: Partial
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        profileViewModel = new ViewModelProvider(requireActivity()).get(ProfileViewModel.class);

        if (profileViewModel.getuid() == null) {
            Toast.makeText(requireActivity(), "Please sign in on profile page!", Toast.LENGTH_SHORT).show();
        }
    }

    // ChatGPT usage: Yes
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentEventsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        RecyclerView recyclerView = root.findViewById(R.id.eventsRecyclerView);
        View.OnClickListener cancelListener = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int position = recyclerView.getChildAdapterPosition((View) view.getParent());
                List<String> eventData = eventsResponse.get(position);
                Log.d(TAG, "onClick: " + eventData);

                networkTaskResult = executorService.submit(() -> {
                    try {
                        URL url = new URL(getResources().getString(R.string.events_url) + "/" + profileViewModel.getuid() + "/events/delete");
                        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                        // Set up the connection for a DELETE request
                        connection.setRequestMethod("DELETE");
                        connection.setReadTimeout(10000);
                        connection.setConnectTimeout(15000);

                        // Set the request body
                        connection.setDoOutput(true);
                        String requestBody = "{\"name\": \"" + eventData.get(0) + "\"}";

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
                            Log.d(TAG, "event deleted");
                            connection.disconnect();
                            return "done";
                        } else {
                            Log.d(TAG, "DELETE request failed with response code: " + responseCode);
                        }

                        connection.disconnect();
                        return null;
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                });

                try {
                    String deleteResult = networkTaskResult.get();
                    Toast.makeText(requireActivity(), "Event deleted!", Toast.LENGTH_SHORT).show();

                    showLoading(root);
                    makeRequest(root);
                } catch (Exception e) {
                    Log.d(TAG, "delete failed with error: " + e);
                }
            }
        };

        View.OnClickListener inviteListener = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int position = recyclerView.getChildAdapterPosition((View) view.getParent());
                List<String> eventData = eventsResponse.get(position);

                // Create a custom view for the dialog
                LayoutInflater inflater = getLayoutInflater();
                View dialogView = inflater.inflate(R.layout.invite_dialog, null);

                AlertDialog.Builder builder = new AlertDialog.Builder(requireActivity());
                builder.setView(dialogView);

                final EditText editText = dialogView.findViewById(R.id.editText);
                final Button btnCancel = dialogView.findViewById(R.id.btnCancel);
                final Button btnInvite = dialogView.findViewById(R.id.dialogInviteButton);

                final AlertDialog dialog = builder.create();

                // Cancel button in dialog
                btnCancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        dialog.dismiss();
                    }
                });

                // Invite button in dialog
                btnInvite.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Log.d(TAG, "onClick: " + eventData);

                        String receiverEmail = editText.getText().toString();
                        Log.d(TAG, "dialog invite: " + receiverEmail);

                        networkTaskResult = executorService.submit(() -> {
                            try {
                                URL url = new URL(getResources().getString(R.string.invite_url) + "/" + profileViewModel.getuid());
                                HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                                // Set up the connection for a POST request
                                connection.setRequestMethod("POST");
                                connection.setReadTimeout(10000);
                                connection.setConnectTimeout(15000);

                                // Set the request body
                                connection.setDoOutput(true);
                                String requestBody = "{\"name\": \"" + eventData.get(0) + "\", \"receiver\": \"" + receiverEmail + "\"}";

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
                                    Log.d(TAG, "invitation sent");
                                    Toast.makeText(requireActivity(), "Invitation sent!", Toast.LENGTH_SHORT).show();
                                    connection.disconnect();
                                    return "done";
                                } else {
                                    Log.d(TAG, "invitation request failed with response code: " + responseCode);
                                }

                                connection.disconnect();
                                return null;
                            } catch (IOException e) {
                                e.printStackTrace();
                                return null;
                            }
                        });

                        dialog.dismiss();
                    }
                });

                dialog.show();
            }
        };

        List<List<String>> emptyList = new ArrayList<>();
        adapter = new EventsRecyclerAdapter(emptyList, cancelListener, inviteListener);

        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        showLoading(root);
        makeRequest(root);

        return root;
    }

    // ChatGPT usage: Partial
    private void showLoading( View view) {
        // Hide the recycler view
        RecyclerView recyclerView = view.findViewById(R.id.eventsRecyclerView);
        recyclerView.setVisibility(View.INVISIBLE);

        // Show the loading page
        ProgressBar progressBar = view.findViewById(R.id.eventsProgressBar);
        progressBar.setVisibility(View.VISIBLE);
        
        TextView loadingText = view.findViewById(R.id.eventsLoadingText);
        loadingText.setVisibility(View.VISIBLE);
    }

    // ChatGPT usage: Yes
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

    // ChatGPT usage: Partial
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
            eventsResponse.clear();

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

    // ChatGPT usage: No
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
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
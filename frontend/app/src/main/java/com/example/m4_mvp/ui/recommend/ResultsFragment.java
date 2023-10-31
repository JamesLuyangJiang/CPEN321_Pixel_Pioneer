package com.example.m4_mvp.ui.recommend;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.m4_mvp.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ResultsFragment extends Fragment {
    final static String TAG = "ResultsFragment";

    private List<List<String>> recResponse = new ArrayList<>();

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
        RecyclerView recyclerView = root.findViewById(R.id.recyclerView);

        // TODO: remove this list for testing
        // List<List<String>> dataList = Arrays.asList(Arrays.asList("Van", "10", "2023-10-30"), Arrays.asList("Edmonton", "20", "2023-11-01"));
        RecyclerAdapter adapter = new RecyclerAdapter(recResponse);

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
}
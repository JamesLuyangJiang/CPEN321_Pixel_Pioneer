package com.example.m4_mvp.ui.recommend;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.m4_mvp.R;

import java.util.List;

public class RecyclerAdapter extends RecyclerView.Adapter<RecyclerAdapter.ViewHolder> {
    final static String TAG = "RecyclerItem";
    private List<List<String>> data;
    private View.OnClickListener buttonOnClickListener;
    private String buttonText;

    public RecyclerAdapter(List<List<String>> data, String buttonText, View.OnClickListener buttonOnClickListener) {
        this.data = data;
        this.buttonText = buttonText;
        this.buttonOnClickListener = buttonOnClickListener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_recommend_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {
        // Text
        holder.placeName.setText(data.get(position).get(0));
        if (buttonText.equals("Select")) {
            holder.placeDistance.setText(data.get(position).get(1));
            holder.planDate.setText(data.get(position).get(2));
        } else {
            holder.placeDistance.setText("");
            holder.planDate.setText(data.get(position).get(1));
        }

        // Button
        holder.button.setText(buttonText);
        holder.button.setOnClickListener(buttonOnClickListener);
    }

    // Change data after getting response from events request
    public void changeData(List<List<String>> newData) {
        this.data.clear();
        this.data.addAll(newData);
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView placeName;
        TextView placeDistance;
        TextView planDate;
        Button button;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            placeName = itemView.findViewById(R.id.placeName);
            placeDistance = itemView.findViewById(R.id.placeDistance);
            planDate = itemView.findViewById(R.id.planDate);
            button = itemView.findViewById(R.id.selectButton);
        }
    }
}

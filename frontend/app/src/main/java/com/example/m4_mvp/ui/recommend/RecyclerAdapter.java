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

    // ChatGPT usage: Yes
    public RecyclerAdapter(List<List<String>> data, String buttonText, View.OnClickListener buttonOnClickListener) {
        this.data = data;
        this.buttonText = buttonText;
        this.buttonOnClickListener = buttonOnClickListener;
    }

    // ChatGPT usage: Partial
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_recommend_item, parent, false);
        return new ViewHolder(view);
    }

    // ChatGPT usage: Partial
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

    // ChatGPT usage: Yes
    @Override
    public int getItemCount() {
        return data.size();
    }

    // ChatGPT usage: Partial
    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView placeName;
        TextView placeDistance;
        TextView planDate;
        Button button;

        // ChatGPT usage: Partial
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            placeName = itemView.findViewById(R.id.eventPlaceName);
            placeDistance = itemView.findViewById(R.id.placeDistance);
            planDate = itemView.findViewById(R.id.eventPlanDate);
            button = itemView.findViewById(R.id.selectButton);
        }
    }
}

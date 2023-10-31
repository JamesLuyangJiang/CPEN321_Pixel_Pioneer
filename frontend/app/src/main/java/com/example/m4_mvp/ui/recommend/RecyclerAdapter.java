package com.example.m4_mvp.ui.recommend;

import android.annotation.SuppressLint;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.m4_mvp.R;

import org.w3c.dom.Text;

import java.util.List;

public class RecyclerAdapter extends RecyclerView.Adapter<RecyclerAdapter.ViewHolder> {
    final static String TAG = "RecyclerItem";
    private List<List<String>> data;

    public RecyclerAdapter(List<List<String>> data) {
        this.data = data;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_recommend_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {
        holder.placeName.setText(data.get(position).get(0));
        holder.placeDistance.setText(data.get(position).get(1));
        holder.planDate.setText(data.get(position).get(2));

        // Set a listener for the button in each item
        holder.button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // TODO: post event request here
                Log.d(TAG, "onClick: " + position);
            }
        });
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

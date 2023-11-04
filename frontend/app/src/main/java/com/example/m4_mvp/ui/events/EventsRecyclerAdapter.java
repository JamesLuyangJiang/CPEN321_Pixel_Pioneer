package com.example.m4_mvp.ui.events;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.m4_mvp.R;

import java.util.List;

public class EventsRecyclerAdapter extends RecyclerView.Adapter<EventsRecyclerAdapter.ViewHolder> {
    final static String TAG = "EventsRecyclerItem";
    private List<List<String>> data;
    private View.OnClickListener cancelListener;
    private View.OnClickListener inviteListener;

    public EventsRecyclerAdapter(List<List<String>> data, View.OnClickListener cancelListener, View.OnClickListener inviteListener) {
        this.data = data;
        this.cancelListener = cancelListener;
        this.inviteListener = inviteListener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_events_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        // Text
        holder.placeName.setText(data.get(position).get(0));
        holder.planDate.setText(data.get(position).get(1));

        // Cancel Button
        holder.cancelButton.setOnClickListener(cancelListener);

        // Invite Button
        holder.inviteButton.setOnClickListener(inviteListener);
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
        TextView planDate;
        Button cancelButton;
        Button inviteButton;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            placeName = itemView.findViewById(R.id.placeName);
            planDate = itemView.findViewById(R.id.planDate);
            cancelButton = itemView.findViewById(R.id.cancelButton);
            inviteButton = itemView.findViewById(R.id.inviteButton);
        }
    }
}

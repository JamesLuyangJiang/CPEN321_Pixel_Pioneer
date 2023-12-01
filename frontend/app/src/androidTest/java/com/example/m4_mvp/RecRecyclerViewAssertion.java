package com.example.m4_mvp;

import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import androidx.test.espresso.NoMatchingViewException;
import androidx.test.espresso.ViewAssertion;

import org.junit.Assert;

public class RecRecyclerViewAssertion implements ViewAssertion {
    private final int position;
    private final int placeNameId;
    private final int placeDistanceId;
    private final int planDateId;
    private final int buttonId;

    // ChatGPT usage: Yes
    public RecRecyclerViewAssertion(int position) {
        this.position = position;
        this.placeNameId = R.id.eventPlaceName;
        this.placeDistanceId = R.id.placeDistance;
        this.planDateId = R.id.eventPlanDate;
        this.buttonId = R.id.selectButton;
    }

    // ChatGPT usage: Yes
    @Override
    public void check(View view, NoMatchingViewException noViewFoundException) {
        if (noViewFoundException != null) {
            throw noViewFoundException;
        }

        RecyclerView recyclerView = (RecyclerView) view;
        RecyclerView.ViewHolder viewHolder = recyclerView.findViewHolderForAdapterPosition(position);

        if (viewHolder != null) {
            View itemView = viewHolder.itemView;
            TextView placeName = itemView.findViewById(placeNameId);
            TextView placeDistance = itemView.findViewById(placeDistanceId);
            TextView planDate = itemView.findViewById(planDateId);
            Button button = itemView.findViewById(buttonId);

            // Check all texts are present and not empty
            Assert.assertNotNull("placeName is null", placeName);
            Assert.assertTrue("placeName is empty", placeName.getText().length() > 0);

            Assert.assertNotNull("placeDistance is null", placeDistance);
            Assert.assertTrue("placeDistance is empty", placeDistance.getText().length() > 0);

            Assert.assertNotNull("planDate is null", planDate);
            Assert.assertTrue("planDate is empty", planDate.getText().length() > 0);

            // Check the button is present
            Assert.assertNotNull("button is null", button);
        } else {
            throw new IllegalStateException("No ViewHolder found at position: " + position);
        }
    }
}
package com.example.m4_mvp;

import android.view.View;
import android.widget.Button;

import androidx.recyclerview.widget.RecyclerView;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.espresso.matcher.ViewMatchers;

import org.hamcrest.Matcher;
import org.hamcrest.Matchers;

import static androidx.test.espresso.matcher.ViewMatchers.isAssignableFrom;
import static androidx.test.espresso.matcher.ViewMatchers.isDescendantOfA;

// ChatGPT usage: Yes
public class ClickOnButtonViewAction implements ViewAction {

    // ChatGPT usage: Yes
    @SuppressWarnings("unchecked")
    @Override
    public Matcher<View> getConstraints() {
        return Matchers.allOf(
                isDescendantOfA(isAssignableFrom(RecyclerView.class)),
                ViewMatchers.isDisplayed()
        );
    }

    // ChatGPT usage: Yes
    @Override
    public String getDescription() {
        return "Click on the button inside ViewHolder at position 0";
    }

    // ChatGPT usage: Yes
    @Override
    public void perform(UiController uiController, View view) {
        RecyclerView recyclerView = findParentRecyclerView(view);
        if (recyclerView == null) {
            throw new IllegalStateException("RecyclerView not found in the hierarchy.");
        }

        // Find the ViewHolder at position 0
        RecyclerView.ViewHolder viewHolder = recyclerView.findViewHolderForAdapterPosition(0);
        if (viewHolder == null) {
            throw new IllegalStateException("ViewHolder not found at position 0.");
        }

        // Find the button inside the ViewHolder
        Button button = viewHolder.itemView.findViewById(R.id.selectButton);
        if (button == null) {
            throw new IllegalStateException("Button with ID R.id.selectButton not found inside ViewHolder.");
        }

        // Perform a click on the button
        button.performClick();
    }

    // ChatGPT usage: Yes
    private RecyclerView findParentRecyclerView(View view) {
        for (View current = view; current != null; current = (View) current.getParent()) {
            if (current instanceof RecyclerView) {
                return (RecyclerView) current;
            }
        }
        return null;
    }
}
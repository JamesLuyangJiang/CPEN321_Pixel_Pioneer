package com.example.m4_mvp;

import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import androidx.test.espresso.Espresso;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.espresso.ViewInteraction;
import androidx.test.espresso.contrib.RecyclerViewActions;
import androidx.test.espresso.matcher.ViewMatchers;

import org.hamcrest.Matcher;
import org.hamcrest.Matchers;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isAssignableFrom;
import static androidx.test.espresso.matcher.ViewMatchers.isDescendantOfA;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;

public class EventRecyclerViewAssertion {
    private static int RECYCLER_VIEW_ID = R.id.eventsRecyclerView;
    private static String[] selectedPlan = new String[3];
    private static boolean found = false;
    private static int foundPosition = -1;

    // ChatGPT usage: Partial
    public static boolean checkEachItem(String[] selectedPlan) {
        EventRecyclerViewAssertion.selectedPlan = selectedPlan;
        Espresso.onView(withId(RECYCLER_VIEW_ID)).perform(new CheckItemAction());
        return EventRecyclerViewAssertion.found;
    }

    // ChatGPT usage: Partial
    private static class CheckItemAction implements ViewAction {

        // ChatGPT usage: Partial
        @Override
        public Matcher<View> getConstraints() {
            return Matchers.allOf(
                    isAssignableFrom(RecyclerView.class),
                    isDisplayed()
            );
        }

        // ChatGPT usage: Partial
        @Override
        public String getDescription() {
            return "Check each item in event RecyclerView";
        }

        // ChatGPT usage: Partial
        @Override
        public void perform(UiController uiController, View view) {
            if (!(view instanceof RecyclerView)) {
                throw new AssertionError("The asserted view is not a RecyclerView");
            }

            RecyclerView recyclerView = (RecyclerView) view;
            RecyclerView.Adapter adapter = recyclerView.getAdapter();

            if (adapter != null) {
                int itemCount = adapter.getItemCount();

                for (int i = 0; i < itemCount; i++) {
                    Espresso.onView(ViewMatchers.withId(RECYCLER_VIEW_ID)).perform(RecyclerViewActions.scrollToPosition(i));
                    Espresso.onView(ViewMatchers.withId(RECYCLER_VIEW_ID)).perform(RecyclerViewActions.actionOnItemAtPosition(i, new CheckItemAssertion(i)));
                }

                // Clicks on the “Cancel” button of the event with the same information as the plan selected in step 1
                if (found) {
                    Espresso.onView(ViewMatchers.withId(RECYCLER_VIEW_ID)).perform(RecyclerViewActions.scrollToPosition(foundPosition));
                    // Click on the “Cancel” button of the selected event
                    Espresso.onView(ViewMatchers.withId(R.id.eventsRecyclerView))
                            .perform(RecyclerViewActions.actionOnItemAtPosition(foundPosition, new ViewAction() {
                                // ChatGPT usage: Yes
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
                                    return "Click on the button inside ViewHolder";
                                }

                                // ChatGPT usage: Yes
                                @Override
                                public void perform(UiController uiController, View view) {
                                    RecyclerView recyclerView = findParentRecyclerView(view);
                                    if (recyclerView == null) {
                                        throw new IllegalStateException("RecyclerView not found in the hierarchy.");
                                    }

                                    // Find the ViewHolder at position 0
                                    RecyclerView.ViewHolder viewHolder = recyclerView.findViewHolderForAdapterPosition(foundPosition);
                                    if (viewHolder == null) {
                                        throw new IllegalStateException("ViewHolder not found");
                                    }

                                    // Find the button inside the ViewHolder
                                    Button button = viewHolder.itemView.findViewById(R.id.cancelButton);
                                    if (button == null) {
                                        throw new IllegalStateException("Button with ID R.id.selectButton not found inside ViewHolder.");
                                    }

                                    // Perform a click on the button
                                    button.performClick();

                                    // Check the loading page present on screen
                                    Espresso.onView(ViewMatchers.withId(R.id.eventsProgressBar))
                                            .check(matches(ViewMatchers.isDisplayed()));
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
                            }));
                }
            }
        }
    }

    // ChatGPT usage: Partial
    private static class CheckItemAssertion implements ViewAction {

        private int position;

        // ChatGPT usage: Partial
        public CheckItemAssertion(int position) {
            this.position = position;
        }

        // ChatGPT usage: Partial
        @Override
        public Matcher<View> getConstraints() {
            return Matchers.allOf(isAssignableFrom(View.class), isDisplayed());
        }

        // ChatGPT usage: Partial
        @Override
        public String getDescription() {
            return "Check item in RecyclerView";
        }

        // ChatGPT usage: Partial
        @Override
        public void perform(UiController uiController, View view) {
            // Replace with your actual IDs
            TextView placeNameTextView = view.findViewById(R.id.placeName);
            TextView planDateTextView = view.findViewById(R.id.planDate);
            Button cancelButton = view.findViewById(R.id.cancelButton);
            Button inviteButton = view.findViewById(R.id.inviteButton);

            // Check if text fields are not empty
            if (placeNameTextView != null && placeNameTextView.getText().toString().isEmpty()) {
                throw new AssertionError("TextView (placeName) at position " + position + " is empty");
            }

            if (planDateTextView != null && planDateTextView.getText().toString().isEmpty()) {
                throw new AssertionError("TextView (planDate) at position " + position + " is empty");
            }

            // Check at least 1 event contains the same information as the plan selected in step 1
            if (placeNameTextView.getText().toString().equals(selectedPlan[0]) && planDateTextView.getText().toString().equals(selectedPlan[2])) {
                foundPosition = position;
                found = true;
            }

            // Check if buttons exist
            if (cancelButton == null) {
                throw new AssertionError("Button (cancelButton) at position " + position + " is not present");
            }

            if (inviteButton == null) {
                throw new AssertionError("Button (inviteButton) at position " + position + " is not present");
            }
        }
    }
}

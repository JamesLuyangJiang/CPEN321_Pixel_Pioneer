package com.example.m4_mvp;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.doesNotExist;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isAssignableFrom;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withEffectiveVisibility;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withParent;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static androidx.test.espresso.matcher.ViewMatchers.isDescendantOfA;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import androidx.test.espresso.Espresso;
import androidx.test.espresso.NoMatchingViewException;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.espresso.ViewInteraction;
import androidx.test.espresso.contrib.RecyclerViewActions;
import androidx.test.espresso.action.ViewActions;
import androidx.test.espresso.matcher.RootMatchers;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.hamcrest.CoreMatchers;
import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.Matchers;
import org.hamcrest.TypeSafeMatcher;
import org.hamcrest.core.IsInstanceOf;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.rule.GrantPermissionRule;
import androidx.test.rule.UiThreadTestRule;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.UiObjectNotFoundException;

import org.junit.Before;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
@LargeTest
public class FrontEndTests {
    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Rule
    public UiThreadTestRule uiThreadTestRule = new UiThreadTestRule();

    @Rule
    public GrantPermissionRule mGrantPermissionRule =
            GrantPermissionRule.grant(
                    "android.permission.ACCESS_FINE_LOCATION",
                    "android.permission.ACCESS_COARSE_LOCATION");

    private UiDevice uiDevice;

    // ChatGPT usage: Partial
    @Before
    public void setUp() {
        // Initialize UiDevice instance
        uiDevice = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
    }

    // ChatGPT usage: Partial
    @Test
    public void fr3Test() throws InterruptedException, UiObjectNotFoundException {
        // Click on the "Profile" menu item in the bottom navigation bar
        uiDevice.findObject(By.res("com.example.m4_mvp:id/navigation_profile")).click();

        if (isViewDisplayed(R.id.sign_in_button)) {
            // Google sign in
            googleSignIn();
        }

        // Click on the “Recommendation” button from the bottom navigation bar
        ViewInteraction bottomNavigationItemView4 = onView(
                allOf(withId(R.id.navigation_recommend), withContentDescription("Recommendation"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_view),
                                        0),
                                1),
                        isDisplayed()));
        bottomNavigationItemView4.perform(click());

        Thread.sleep(1000);

        // Check the number picker is present on screen
        onView(ViewMatchers.withId(R.id.datePicker))
                .check(matches(isDisplayed()));

        // Check the “Go!” button is present on screen
        onView(ViewMatchers.withId(R.id.recommendButton))
                .check(matches(isDisplayed()));

        // Select “7” in the number picker
        onView(ViewMatchers.withId(R.id.datePicker)).perform(ViewActions.swipeUp());

        Thread.sleep(1500);

        // Press the “Go!” button
        ViewInteraction materialButton = onView(
                allOf(withId(R.id.recommendButton), withText("Go!"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_host_fragment_activity_main),
                                        0),
                                2),
                        isDisplayed()));
        materialButton.perform(click());

        // Check the presence of loading animation
        // Note: sometimes the progress bar stays for too short time that it is not even enough time to detect it, so commented here.
//        onView(ViewMatchers.withId(R.id.progressBar))
//                .check(matches(isDisplayed()));

        // Wait until the result page presents
        while (true) {
            Thread.sleep(1000);
            UiObject2 resultList = uiDevice.findObject(By.clazz("androidx.recyclerview.widget.RecyclerView"));
            if (resultList != null) {
                break;
            }
        }

        // Check all results contain the required information and a “Select” button
        for (int i = 0; i < 10; i++) {
            // Perform a scroll action to ensure the item is on the screen
            onView(ViewMatchers.withId(R.id.recRecyclerView))
                    .perform(RecyclerViewActions.scrollToPosition(i));

            // Check that the TextView within the ViewHolder at position i is not empty
            onView(ViewMatchers.withId(R.id.recRecyclerView))
                    .check(new RecRecyclerViewAssertion(i));
        }

        // Click on the “Stars” button from the bottom navigation bar
        ViewInteraction backHome = onView(
                allOf(withId(R.id.navigation_stars), withContentDescription("Stars"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_view),
                                        0),
                                0),
                        isDisplayed()));
        backHome.perform(click());

        Thread.sleep(1000);
    }

    // ChatGPT usage: Partial
    @Test
    public void fr4Test() throws Throwable {
        // Prerequisite steps
        // Click on the "Profile" menu item in the bottom navigation bar
        uiDevice.findObject(By.res("com.example.m4_mvp:id/navigation_profile")).click();

        if (isViewDisplayed(R.id.sign_in_button)) {
            // Google sign in
            googleSignIn();
        }

        // Prerequisite steps to get to the results page of recommendation
        ViewInteraction bottomNavigationItemView4 = onView(
                allOf(withId(R.id.navigation_recommend), withContentDescription("Recommendation"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_view),
                                        0),
                                1),
                        isDisplayed()));
        bottomNavigationItemView4.perform(click());

        Thread.sleep(1000);

        ViewInteraction materialButton = onView(
                allOf(withId(R.id.recommendButton), withText("Go!"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_host_fragment_activity_main),
                                        0),
                                2),
                        isDisplayed()));
        materialButton.perform(click());

        Thread.sleep(500);

        while (true) {
            Thread.sleep(1000);
            UiObject2 resultList = uiDevice.findObject(By.clazz("androidx.recyclerview.widget.RecyclerView"));
            if (resultList != null) {
                break;
            }
        }

        final String[] selectedPlan = new String[3];

        // Click on the “Select” button of one of the plans
        onView(ViewMatchers.withId(R.id.recRecyclerView))
                .perform(RecyclerViewActions.actionOnItemAtPosition(0, new ViewAction() {
                    // ChatGPT usage: Yes
                    @Override
                    public Matcher<View> getConstraints() {
                        return allOf(
                                isDescendantOfA(isAssignableFrom(RecyclerView.class)),
                                isDisplayed()
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

                        // Store the selected plan information
                        selectedPlan[0] = ((TextView) viewHolder.itemView.findViewById(R.id.eventPlaceName)).getText().toString();
                        selectedPlan[1] = ((TextView) viewHolder.itemView.findViewById(R.id.placeDistance)).getText().toString();
                        selectedPlan[2] = ((TextView) viewHolder.itemView.findViewById(R.id.eventPlanDate)).getText().toString();

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
                }));

        // Check the message “Event created!” is present on screen
        onView(withText("Event created!"))
                .inRoot(ToastMatcher.isToast())
                .check(matches(isDisplayed()));

        Thread.sleep(2000);

        // Click on the “Events” button from the bottom navigation bar
        ViewInteraction eventsClick = onView(
                allOf(withId(R.id.navigation_events), withContentDescription("Events"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_view),
                                        0),
                                2),
                        isDisplayed()));
        eventsClick.perform(click());

        // Wait for the events to be returned from the server
        while (true) {
            Thread.sleep(1000);
            UiObject2 resultList = uiDevice.findObject(By.res("com.example.m4_mvp:id/eventsRecyclerView"));
            if (resultList != null) {
                break;
            }
        }

        Thread.sleep(1000);

        int numEvents = getCountFromRecyclerView(R.id.eventsRecyclerView);
        final int[] found = {-1};

        // Check all events contain the required information, an “Invite” button, and a “Cancel” button
        for (int i = 0; i < numEvents; i++) {
            // Perform a scroll action to ensure the item is on the screen
            onView(ViewMatchers.withId(R.id.eventsRecyclerView))
                    .perform(RecyclerViewActions.scrollToPosition(i));

            // Perform checks on the view holder at position i
            onView(ViewMatchers.withId(R.id.eventsRecyclerView))
                    .perform(RecyclerViewActions.actionOnItemAtPosition(i,
                            new ViewAction() {
                                @Override
                                public Matcher<View> getConstraints() {
                                    // Specify the constraints for the action
                                    return isAssignableFrom(RecyclerView.class);
                                }

                                @Override
                                public String getDescription() {
                                    return "Get text from item at position 2";
                                }

                                @Override
                                public void perform(UiController uiController, View view) {
                                    int position = ((RecyclerView) view.getParent()).getChildAdapterPosition(view);
                                    // Get all elements from the view holder at current position i
                                    TextView placeNameTextView = view.findViewById(R.id.eventPlaceName);
                                    TextView planDateTextView = view.findViewById(R.id.eventPlanDate);
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
                                        found[0] = position;
                                    }

                                    // Check if buttons exist
                                    if (cancelButton == null) {
                                        throw new AssertionError("Button (cancelButton) at position " + position + " is not present");
                                    }

                                    if (inviteButton == null) {
                                        throw new AssertionError("Button (inviteButton) at position " + position + " is not present");
                                    }
                                }
                            }));
        }

        // Check at least 1 event contains the same information as the plan selected in step 1
        if (found[0] == -1) {
            throw new AssertionError("No selected plan found in events!");
        }

        // Clicks on the “Cancel” button of the event with the same information as the plan selected in step 1
        onView(ViewMatchers.withId(R.id.eventsRecyclerView))
                .perform(RecyclerViewActions.scrollToPosition(found[0]));

        onView(ViewMatchers.withId(R.id.eventsRecyclerView))
                .perform(RecyclerViewActions.actionOnItemAtPosition(found[0],
                        ClickOnButtonViewAction.clickChildViewWithId(R.id.cancelButton)));

        // Check the loading page present on screen
        // Note: sometimes the progress bar stays for too short time that it is not even enough time to detect it, so commented here.
//        onView(ViewMatchers.withId(R.id.eventsProgressBar))
//                .check(matches(isDisplayed()));

        Thread.sleep(2000);

        // If no more events left, means the previous event deleted, so no need to check
        if (!isInVisible(R.id.noEventsTitle)) {
            return;
        }

        int newNumEvents = getCountFromRecyclerView(R.id.eventsRecyclerView);
        final int[] oldExist = {-1};

        // Check no events have the same information as the event chosen for cancellation in step 4
        for (int i = 0; i < newNumEvents; i++) {
            // Perform a scroll action to ensure the item is on the screen
            onView(ViewMatchers.withId(R.id.eventsRecyclerView))
                    .perform(RecyclerViewActions.scrollToPosition(i));

            // Perform checks on the view holder at position i
            onView(ViewMatchers.withId(R.id.eventsRecyclerView))
                    .perform(RecyclerViewActions.actionOnItemAtPosition(i,
                            new ViewAction() {
                                @Override
                                public Matcher<View> getConstraints() {
                                    // Specify the constraints for the action
                                    return isAssignableFrom(RecyclerView.class);
                                }

                                @Override
                                public String getDescription() {
                                    return "Get text from item at position 2";
                                }

                                @Override
                                public void perform(UiController uiController, View view) {
                                    int position = ((RecyclerView) view.getParent()).getChildAdapterPosition(view);
                                    // Get elements from the view holder at current position i
                                    TextView placeNameTextView = view.findViewById(R.id.eventPlaceName);
                                    TextView planDateTextView = view.findViewById(R.id.eventPlanDate);

                                    // Check no events have the same information as the event chosen for cancellation in step 4
                                    if (placeNameTextView.getText().toString().equals(selectedPlan[0]) && planDateTextView.getText().toString().equals(selectedPlan[2])) {
                                        oldExist[0] = position;
                                    }
                                }
                            }));
        }

        // Check no events have the same information as the event chosen for cancellation in step 4
        if (oldExist[0] != -1) {
            throw new AssertionError("Canceled event still in the list!");
        }

        Thread.sleep(1000);
    }

    // ChatGPT usage: Partial
    @Test
    public void fr5Test() throws Throwable {
        // Prerequisite steps
        // Click on the "Profile" menu item in the bottom navigation bar
        uiDevice.findObject(By.res("com.example.m4_mvp:id/navigation_profile")).click();

        if (isViewDisplayed(R.id.sign_in_button)) {
            // Google sign in
            googleSignIn();
        }

        // Prerequisite steps to create an event
        ViewInteraction bottomNavigationItemView4 = onView(
                allOf(withId(R.id.navigation_recommend), withContentDescription("Recommendation"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_view),
                                        0),
                                1),
                        isDisplayed()));
        bottomNavigationItemView4.perform(click());

        Thread.sleep(1000);

        ViewInteraction materialButton = onView(
                allOf(withId(R.id.recommendButton), withText("Go!"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_host_fragment_activity_main),
                                        0),
                                2),
                        isDisplayed()));
        materialButton.perform(click());

        Thread.sleep(500);

        while (true) {
            Thread.sleep(1000);
            UiObject2 resultList = uiDevice.findObject(By.clazz("androidx.recyclerview.widget.RecyclerView"));
            if (resultList != null) {
                break;
            }
        }

        ViewInteraction materialButton2 = onView(
                allOf(withId(R.id.selectButton), withText("Select"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.recRecyclerView),
                                        0),
                                3),
                        isDisplayed()));
        materialButton2.perform(click());

        // Click on the “Events” button in the bottom navigation bar
        ViewInteraction eventsClick = onView(
                allOf(withId(R.id.navigation_events), withContentDescription("Events"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.nav_view),
                                        0),
                                2),
                        isDisplayed()));
        eventsClick.perform(click());

        // Click on the “Invite” button on any events
        ViewInteraction materialButton3 = onView(
                allOf(withId(R.id.inviteButton), withText("Invite"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.eventsRecyclerView),
                                        0),
                                3),
                        isDisplayed()));
        materialButton3.perform(click());

        Thread.sleep(1000);

        // Check the dialog is present on screen with a text input, an “Invite” button, and a “Cancel” button
        ViewInteraction linearLayout = onView(
                allOf(withParent(allOf(withId(android.R.id.custom),
                                withParent(IsInstanceOf.<View>instanceOf(android.widget.FrameLayout.class)))),
                        isDisplayed()));
        linearLayout.check(matches(isDisplayed()));

        ViewInteraction editText = onView(
                allOf(withId(R.id.searchText),
                        withParent(withParent(withId(android.R.id.custom))),
                        isDisplayed()));
        editText.check(matches(isDisplayed()));

        ViewInteraction button = onView(
                allOf(withId(R.id.dialogInviteButton), withText("INVITE"),
                        withParent(withParent(IsInstanceOf.<View>instanceOf(android.widget.LinearLayout.class))),
                        isDisplayed()));
        button.check(matches(isDisplayed()));

        ViewInteraction button2 = onView(
                allOf(withId(R.id.btnCancel), withText("CANCEL"),
                        withParent(withParent(IsInstanceOf.<View>instanceOf(android.widget.LinearLayout.class))),
                        isDisplayed()));
        button2.check(matches(isDisplayed()));

        // Enter “cpen” in the text input
        ViewInteraction materialAutoCompleteTextView = onView(
                allOf(withId(R.id.searchText),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.custom),
                                        0),
                                0),
                        isDisplayed()));
        materialAutoCompleteTextView.perform(replaceText("cpen"), closeSoftKeyboard());

        // Click on the “Invite” button in the dialog
        ViewInteraction materialButton4 = onView(
                allOf(withId(R.id.dialogInviteButton), withText("Invite"),
                        childAtPosition(
                                childAtPosition(
                                        withClassName(is("android.widget.LinearLayout")),
                                        1),
                                1),
                        isDisplayed()));
        materialButton4.perform(click());

        Thread.sleep(10);

        // Check the message “Invalid email address!” is present on screen
        onView(withText("Invalid user email!"))
                .inRoot(ToastMatcher.isToast())
                .check(matches(isDisplayed()));

        // Continue enter “321” in the text input after the existing “cpen”
        ViewInteraction materialAutoCompleteTextView2 = onView(
                allOf(withId(R.id.searchText), withText("cpen"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.custom),
                                        0),
                                0),
                        isDisplayed()));
        materialAutoCompleteTextView2.perform(click());

        ViewInteraction materialAutoCompleteTextView3 = onView(
                allOf(withId(R.id.searchText), withText("cpen"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.custom),
                                        0),
                                0),
                        isDisplayed()));
        materialAutoCompleteTextView3.perform(replaceText("cpen321"));

        // Check the drop down list is present on screen and all of them begin with the letters “cpen321”
        String searchText = "cpen321";

        int itemCount = getItemCount(R.id.searchText);

        for (int position = 0; position < itemCount; position++) {
            Espresso.onData(CoreMatchers.anything())
                    .inRoot(RootMatchers.isPlatformPopup())
                    .atPosition(position)
                    .check(matches(withText(CoreMatchers.startsWith(searchText))));
        }

        Thread.sleep(1000);

        // Click on the email with text of “cpen321pixelpioneer@gmail.com”
        onView(withText("cpen321pixelpioneer@gmail.com"))
                .inRoot(RootMatchers.isPlatformPopup())
                .perform(click());

        Thread.sleep(1000);

        // Check the text input contains the same email as the one selected in step 6: “cpen321pixelpioneer@gmail.com”
        ViewInteraction editText2 = onView(
                allOf(withId(R.id.searchText), withText("cpen321pixelpioneer@gmail.com"),
                        withParent(withParent(withId(android.R.id.custom))),
                        isDisplayed()));
        editText2.check(matches(withText("cpen321pixelpioneer@gmail.com")));

        // Click on the “Invite” button in the dialog
        ViewInteraction materialButton5 = onView(
                allOf(withId(R.id.dialogInviteButton), withText("Invite"),
                        childAtPosition(
                                childAtPosition(
                                        withClassName(is("android.widget.LinearLayout")),
                                        1),
                                1),
                        isDisplayed()));
        materialButton5.perform(click());

        Thread.sleep(1000);

        // Check the on-screen message “Invitation sent!” is present on screen
        onView(withText("Invitation sent!"))
                .inRoot(ToastMatcher.isToast())
                .check(matches(isDisplayed()));

        Thread.sleep(1000);

        // Check no dialog is present on screen
        onView(withId(R.id.dialogInviteButton))
                .check(doesNotExist());
    }

    // ChatGPT usage: Partial
    @Test
    public void skyChartTest() throws InterruptedException {
        Thread.sleep(10000);

        String testDiff = getTextFromTextView(R.id.testDiff);

        assert(Float.parseFloat(testDiff) < 15.00 && Float.parseFloat(testDiff) > 0);
    }

    // ChatGPT usage: Partial
    @Test
    public void easeOfUseTest() throws InterruptedException {
        int clickCount = 0;
        // Click on the "Profile" menu item in the bottom navigation bar
        uiDevice.findObject(By.res("com.example.m4_mvp:id/navigation_profile")).click();
        clickCount++;

        // Wait for the fragment to load
        Thread.sleep(1000);

        // Click on the Google Sign-In button
        ViewInteraction id = onView(
                allOf(withText("Sign in"),
                        childAtPosition(
                                allOf(withId(R.id.sign_in_button),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                0)),
                                0),
                        isDisplayed()));
        id.perform(click());
        clickCount++;

        while (true) {
            Thread.sleep(1000);
            UiObject2 accountElement = uiDevice.findObject(By.text("CPEN321"));
            UiObject2 emailField = uiDevice.findObject(By.clazz("android.widget.EditText"));
            if (accountElement != null) {
                accountElement.click();
                clickCount++;
                Thread.sleep(3000);
                break;
            } else if (emailField != null) {
                // Entering the email
                emailField.setText("cpen321pixelpioneer@gmail.com");
                clickCount++;
                uiDevice.findObject(By.text("NEXT")).click();
                clickCount++;

                // Entering the password
                while (true) {
                    Thread.sleep(1000);
                    UiObject2 passwordField = uiDevice.findObject(By.clazz("android.widget.EditText"));
                    if (passwordField != null) {
                        passwordField.setText("pixel321!");
                        uiDevice.findObject(By.text("NEXT")).click();
                        clickCount++;
                        break;
                    }
                }

                // Agree terms and conditions
                clickButton("I agree");
                clickCount++;
                clickButton("MORE");
                clickCount++;
                clickButton("ACCEPT");
                clickCount++;
                Thread.sleep(6000);
                break;
            }
        }

        Thread.sleep(2000);

        if (clickCount >= 10) {
            throw new IllegalStateException("Number of clicks exceeds maximum of 10!");
        }
    }

    // ChatGPT usage: Partial
    private void googleSignIn() throws UiObjectNotFoundException, InterruptedException {
        // Wait for the fragment to load
        Thread.sleep(1500);

        // Click on the Google Sign-In button
        ViewInteraction id = onView(
                allOf(withText("Sign in"),
                        childAtPosition(
                                allOf(withId(R.id.sign_in_button),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                0)),
                                0),
                        isDisplayed()));
        id.perform(click());

        while (true) {
            Thread.sleep(1000);
            UiObject2 accountElement = uiDevice.findObject(By.text("CPEN321"));
            UiObject2 emailField = uiDevice.findObject(By.clazz("android.widget.EditText"));
            if (accountElement != null) {
                accountElement.click();
                Thread.sleep(3000);
                break;
            } else if (emailField != null) {
                // Entering the email
                emailField.setText("cpen321pixelpioneer@gmail.com");
                uiDevice.findObject(By.text("NEXT")).click();

                // Entering the password
                while (true) {
                    Thread.sleep(1000);
                    UiObject2 passwordField = uiDevice.findObject(By.clazz("android.widget.EditText"));
                    if (passwordField != null) {
                        passwordField.setText("pixel321!");
                        uiDevice.findObject(By.text("NEXT")).click();
                        break;
                    }
                }

                // Agree terms and conditions
                clickButton("I agree");
                clickButton("MORE");
                clickButton("ACCEPT");
                Thread.sleep(6000);
                break;
            }
        }
    }

    // ChatGPT usage: Partial
    private void clickButton(String text) throws InterruptedException {
        while (true) {
            Thread.sleep(500);
            UiObject2 button = uiDevice.findObject(By.text(text));
            if (button != null) {
                button.click();
                return;
            }
        }
    }

    // ChatGPT usage: Yes
    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }

    // ChatGPT usage: No
    private static int getCountFromRecyclerView(int RecyclerViewId) {
        final int[] COUNT = {0};
        Matcher matcher = new TypeSafeMatcher<View>() {
            @Override
            protected boolean matchesSafely(View item) {
                COUNT[0] = ((RecyclerView) item).getAdapter().getItemCount();
                return true;
            }
            @Override
            public void describeTo(Description description) {}
        };
        onView(allOf(withId(RecyclerViewId),isDisplayed())).check(matches(matcher));
        return COUNT[0];
    }

    // ChatGPT usage: Yes
    private static String getTextFromTextView(int textViewId) {
        final String[] text = {null};
        onView(withId(textViewId)).perform(new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return isAssignableFrom(TextView.class);
            }

            @Override
            public String getDescription() {
                return "Getting text from TextView";
            }

            @Override
            public void perform(UiController uiController, View view) {
                text[0] = ((TextView) view).getText().toString();
            }
        });
        return text[0];
    }

    // ChatGPT usage: Yes
    private boolean isViewDisplayed(int viewId) {
        try {
            onView(withId(viewId)).check(matches(isDisplayed()));
            return true;
        } catch (NoMatchingViewException e) {
            return false;
        }
    }

    // ChatGPT usage: No
    private boolean isInVisible(int viewId) {
        try {
            onView(withId(viewId)).check(matches(withEffectiveVisibility(ViewMatchers.Visibility.INVISIBLE)));
            return true;
        } catch (AssertionError e) {
            return false;
        }
    }

    // ChatGPT usage: Yes
    private int getItemCount(int autoCompleteTextViewId) {
        final int[] itemCount = new int[1];
        onView(withId(autoCompleteTextViewId)).check((view, noViewFoundException) -> {
            if (noViewFoundException != null) {
                itemCount[0] = 0;
            } else {
                itemCount[0] = ((AutoCompleteTextView) view).getAdapter().getCount();
            }
        });
        return itemCount[0];
    }
}
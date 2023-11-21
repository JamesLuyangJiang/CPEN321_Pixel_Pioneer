package com.example.m4_mvp;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isAssignableFrom;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static androidx.test.espresso.matcher.ViewMatchers.isDescendantOfA;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.Button;
import android.widget.TextView;

import androidx.fragment.app.testing.FragmentScenario;
import androidx.recyclerview.widget.RecyclerView;
import androidx.test.espresso.Espresso;
import androidx.test.espresso.NoMatchingViewException;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.espresso.ViewAssertion;
import androidx.test.espresso.ViewInteraction;
import androidx.test.espresso.contrib.RecyclerViewActions;
import androidx.test.espresso.action.ViewActions;
import androidx.test.espresso.assertion.ViewAssertions;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.Matchers;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.rule.GrantPermissionRule;
import androidx.test.rule.UiThreadTestRule;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.UiObjectNotFoundException;

import com.example.m4_mvp.ui.stars.StarsFragment;

import org.junit.Before;

import java.util.Arrays;

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

    @Before
    public void setUp() {
        // Initialize UiDevice instance
        uiDevice = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
    }

    @Test
    public void fr3Test() throws InterruptedException, UiObjectNotFoundException {
        // Google sign in
        googleSignIn();

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
        Espresso.onView(ViewMatchers.withId(R.id.datePicker))
                .check(matches(ViewMatchers.isDisplayed()));

        // Check the “Go!” button is present on screen
        Espresso.onView(ViewMatchers.withId(R.id.recommendButton))
                .check(matches(ViewMatchers.isDisplayed()));

        // Select “7” in the number picker
        Espresso.onView(ViewMatchers.withId(R.id.datePicker)).perform(ViewActions.swipeUp());

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

        Thread.sleep(500);

        // Check the presence of loading animation
        Espresso.onView(ViewMatchers.withId(R.id.progressBar))
                .check(matches(ViewMatchers.isDisplayed()));

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
            Espresso.onView(ViewMatchers.withId(R.id.recRecyclerView))
                    .perform(RecyclerViewActions.scrollToPosition(i));

            // Check that the TextView within the ViewHolder at position i is not empty
            Espresso.onView(ViewMatchers.withId(R.id.recRecyclerView))
                    .check(new RecRecyclerViewAssertion(i));
        }

        // Click on the “Recommendation” button from the bottom navigation bar
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

    @Test
    public void fr4Test() throws Throwable {
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
        Espresso.onView(ViewMatchers.withId(R.id.recRecyclerView))
                .perform(RecyclerViewActions.actionOnItemAtPosition(0, new ViewAction() {
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
                        selectedPlan[0] = ((TextView) viewHolder.itemView.findViewById(R.id.placeName)).getText().toString();
                        selectedPlan[1] = ((TextView) viewHolder.itemView.findViewById(R.id.placeDistance)).getText().toString();
                        selectedPlan[2] = ((TextView) viewHolder.itemView.findViewById(R.id.planDate)).getText().toString();

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
        Espresso.onView(withText("Event created!"))
                .inRoot(ToastMatcher.isToast())
                .check(matches(isDisplayed()));

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

        // Check all events contain the required information, an “Invite” button, and a “Cancel” button
        boolean found = EventRecyclerViewAssertion.checkEachItem(selectedPlan);

        // Check at least 1 event contains the same information as the plan selected in step 1
        if (!found) {
            throw new AssertionError("No same event created!");
        }

        // Check no events have the same information as the event chosen for cancellation in step 4
        boolean newFound = EventRecyclerViewAssertion.checkEachItem(selectedPlan);

        if (newFound) {
            throw new AssertionError("Selected event not removed!");
        }

        Thread.sleep(10000);
    }

    @Test
    public void fr5Test() throws Throwable {
        // Prerequisite steps
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
        Espresso.onView(ViewMatchers.withId(R.id.eventsRecyclerView))
                .perform(RecyclerViewActions.actionOnItemAtPosition(0, new ViewAction() {
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
                        Button button = viewHolder.itemView.findViewById(R.id.inviteButton);
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
                }));

        // Check the dialog is present on screen with a text input and an “Invite” button
        Espresso.onView(ViewMatchers.withId(R.id.editText))
                .check(matches(ViewMatchers.isDisplayed()));

        Espresso.onView(ViewMatchers.withId(R.id.dialogInviteButton))
                .check(matches(ViewMatchers.isDisplayed()));

        // Enter “testing” in the text input
        Espresso.onView(ViewMatchers.withId(R.id.editText))
                .perform(ViewActions.typeText("testing"));

        // Click on the “Invite” button
        Espresso.onView(ViewMatchers.withId(R.id.dialogInviteButton))
                .perform(ViewActions.click());

        // Check the on-screen message “Invalid email address! Please retry!” is present on screen
        Espresso.onView(withText("Invalid email address! Please retry!"))
                .inRoot(ToastMatcher.isToast())
                .check(matches(isDisplayed()));

        // Enter “nosuchuser@gmail.com” in the text input
        Espresso.onView(ViewMatchers.withId(R.id.editText))
                .perform(ViewActions.typeText("nosuchuser@gmail.com"));

        // Click on the “Invite” button
        Espresso.onView(ViewMatchers.withId(R.id.dialogInviteButton))
                .perform(ViewActions.click());

        // Check the on-screen message “No user found with this email address!” is present on screen
        Espresso.onView(withText("No user found with this email address!"))
                .inRoot(ToastMatcher.isToast())
                .check(matches(isDisplayed()));

        // Enter “jamesjiangluyang@gmail.com”  in the text input
        Espresso.onView(ViewMatchers.withId(R.id.editText))
                .perform(ViewActions.typeText("jamesjiangluyang@gmail.com"));

        // Click on the “Invite” button
        Espresso.onView(ViewMatchers.withId(R.id.dialogInviteButton))
                .perform(ViewActions.click());

        // Check no dialog is present on screen
        Espresso.onView(ViewMatchers.withId(R.id.dialogInviteButton)).check(ViewAssertions.doesNotExist());

        // Check the on-screen message “Invitation sent!” is present on screen
        Espresso.onView(withText("Invitation sent!"))
                .inRoot(ToastMatcher.isToast())
                .check(matches(isDisplayed()));
    }

    // ChatGPT usage: Partial
//    @Test
//    public void skyChartTest() throws InterruptedException {
//        Thread.sleep(20000);
//
//        FragmentScenario<StarsFragment> fragmentScenario = FragmentScenario.launch(StarsFragment.class);
//
//        // Access the fragment instance and its public variable
//        fragmentScenario.onFragment(fragment -> {
//            double yourVariable = fragment.getDiff();
//
//            // Perform assertions on yourVariable
//            assert(yourVariable < 15.00);
//        });
//    }
//
//    // ChatGPT usage: Partial
//    @Test
//    public void easeOfUseTest() throws InterruptedException {
//        int clickCount = 0;
//        // Click on the "Profile" menu item in the bottom navigation bar
//        uiDevice.findObject(By.res("com.example.m4_mvp:id/navigation_profile")).click();
//        clickCount++;
//
//        // Wait for the fragment to load
//        Thread.sleep(1000);
//
//        // Click on the Google Sign-In button
//        ViewInteraction id = onView(
//                allOf(withText("Sign in"),
//                        childAtPosition(
//                                allOf(withId(R.id.sign_in_button),
//                                        childAtPosition(
//                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
//                                                0)),
//                                0),
//                        isDisplayed()));
//        id.perform(click());
//        clickCount++;
//
//        while (true) {
//            Thread.sleep(1000);
//            UiObject2 accountElement = uiDevice.findObject(By.text("CPEN321"));
//            UiObject2 emailField = uiDevice.findObject(By.clazz("android.widget.EditText"));
//            if (accountElement != null) {
//                accountElement.click();
//                clickCount++;
//                Thread.sleep(3000);
//                break;
//            } else if (emailField != null) {
//                // Entering the email
//                emailField.setText("cpen321pixelpioneer@gmail.com");
//                clickCount++;
//                uiDevice.findObject(By.text("NEXT")).click();
//                clickCount++;
//
//                // Entering the password
//                while (true) {
//                    Thread.sleep(1000);
//                    UiObject2 passwordField = uiDevice.findObject(By.clazz("android.widget.EditText"));
//                    if (passwordField != null) {
//                        passwordField.setText("pixel321!");
//                        uiDevice.findObject(By.text("NEXT")).click();
//                        clickCount++;
//                        break;
//                    }
//                }
//
//                // Agree terms and conditions
//                clickButton("I agree");
//                clickCount++;
//                clickButton("MORE");
//                clickCount++;
//                clickButton("ACCEPT");
//                clickCount++;
//                Thread.sleep(6000);
//                break;
//            }
//        }
//
//        Thread.sleep(3000);
//
//        if (clickCount >= 10) {
//            throw new IllegalStateException("Number of clicks exceeds maximum of 10!");
//        }
//    }

    private void googleSignIn() throws UiObjectNotFoundException, InterruptedException {
        // Click on the "Profile" menu item in the bottom navigation bar
        uiDevice.findObject(By.res("com.example.m4_mvp:id/navigation_profile")).click();

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
}
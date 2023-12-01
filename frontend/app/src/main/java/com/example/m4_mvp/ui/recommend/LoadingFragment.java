package com.example.m4_mvp.ui.recommend;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import com.example.m4_mvp.R;

public class LoadingFragment extends Fragment {

    // ChatGPT usage: Yes
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_loading, container, false);

        // Apply the combined fade-in and translate animation
        Animation fadeInFromBottomAnimation = AnimationUtils.loadAnimation(requireContext(), R.anim.fragment_fade_in);
        view.startAnimation(fadeInFromBottomAnimation);

        return view;
    }
}
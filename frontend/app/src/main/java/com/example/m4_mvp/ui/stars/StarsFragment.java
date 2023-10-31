package com.example.m4_mvp.ui.stars;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import com.example.m4_mvp.databinding.FragmentStarsBinding;

public class StarsFragment extends Fragment {

private FragmentStarsBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
            ViewGroup container, Bundle savedInstanceState) {
        StarsViewModel starsViewModel =
                new ViewModelProvider(this).get(StarsViewModel.class);

    binding = FragmentStarsBinding.inflate(inflater, container, false);
    View root = binding.getRoot();

        final TextView textView = binding.textStars;
        starsViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

@Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
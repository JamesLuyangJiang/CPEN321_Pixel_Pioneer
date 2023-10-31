package com.example.m4_mvp.ui.stars;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class StarsViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public StarsViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is stars fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}
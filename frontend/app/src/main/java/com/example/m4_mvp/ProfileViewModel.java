package com.example.m4_mvp;

import android.content.Context;

import androidx.lifecycle.ViewModel;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

public class ProfileViewModel extends ViewModel {
    private GoogleSignInAccount googleAccount;
    private int maxDistance;

    public GoogleSignInAccount getGoogleAccount() {
        return googleAccount;
    }

    public void setGoogleAccount(GoogleSignInAccount account) {
        this.googleAccount = account;
    }

    public void initGoogleAccount(Context context) { googleAccount = GoogleSignIn.getLastSignedInAccount(context); }

    public void setMaxDistance(String distance) { this.maxDistance = Integer.parseInt(distance); }

    public int getMaxDistance() { return this.maxDistance; }

}
package com.example.m4_mvp;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.lifecycle.ViewModel;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

public class ProfileViewModel extends ViewModel {
    private GoogleSignInAccount googleAccount;
    private SharedPreferences sharedPreferences;
    private String token;

    public GoogleSignInAccount getGoogleAccount() {
        return googleAccount;
    }

    public void setGoogleAccount(GoogleSignInAccount account) {
        this.googleAccount = account;
    }

    public void initGoogleAccount(Context context) { googleAccount = GoogleSignIn.getLastSignedInAccount(context); }

    public void setMaxDistance(String distance) {
        SharedPreferences.Editor editor = this.sharedPreferences.edit();
        editor.putString("maxDistance", distance);
        editor.apply();
    }

    public int getMaxDistance() {
        if (this.sharedPreferences.getString("maxDistance", null) == null) {
            return -1;
        } else {
            return Integer.parseInt(this.sharedPreferences.getString("maxDistance", null));
        }
    }

    public void setuid(String uid) {
        SharedPreferences.Editor editor = this.sharedPreferences.edit();
        editor.putString("uid", uid);
        editor.apply();
    }

    public String getuid() {
        return this.sharedPreferences.getString("uid", null);
    }

    public void setSharedPreferences(SharedPreferences sharedPreferences) { this.sharedPreferences = sharedPreferences; };

    public void setToken (String token) { this.token = token; }

    public String getToken () { return this.token; }
}
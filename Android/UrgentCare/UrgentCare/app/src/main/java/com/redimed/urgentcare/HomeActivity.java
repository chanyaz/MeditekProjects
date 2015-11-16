package com.redimed.urgentcare;

import android.annotation.TargetApi;
import android.content.Intent;
import android.graphics.Point;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Display;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.widget.ImageView;

import com.andexert.library.RippleView;
import com.google.gson.JsonObject;
import com.redimed.urgentcare.api.UrgentRequestApi;
import com.redimed.urgentcare.utils.BlurTransformation;
import com.redimed.urgentcare.utils.Config;
import com.redimed.urgentcare.utils.RetrofitClient;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import butterknife.Bind;
import butterknife.ButterKnife;
import info.hoang8f.widget.FButton;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class HomeActivity extends AppCompatActivity {
    @Bind(R.id.imgLogoRedimed) ImageView imgLogoRedimed;
    @Bind(R.id.imgBackgroundHome) ImageView imgBackgroundHome;
    @Bind(R.id.rippleViewSportInjury) RippleView rippleViewSportInjury;
    @Bind(R.id.rippleViewWorkInjury) RippleView rippleViewWorkInjury;
    @Bind(R.id.rippleViewOrthopaedic) RippleView rippleViewOrthopaedic;
    @Bind(R.id.rippleViewPlasticInjury) RippleView rippleViewPlasticInjury;
    @Bind(R.id.rippleViewCallUs) RippleView rippleViewCallUs;
    @Bind(R.id.btnFaq) FButton btnFaq;
    @Bind(R.id.btnUrgentCare) FButton btnUrgentCare;

    private static final int BACKGROUND_IMAGES_WIDTH = 360;
    private static final int BACKGROUND_IMAGES_HEIGHT = 360;
    private static final float BLUR_RADIUS = 25F;

    private BlurTransformation blurTransformation;
    private int backgroundIndex;
    private Point backgroundImageTargetSize;

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        // Initialize default values
        ButterKnife.bind(this);

        CreateJsonDataSuburb();

        Picasso.with(HomeActivity.this).load(R.drawable.img_logo_redimed).fit().into(imgLogoRedimed);

        TranslateAnimation animation = new TranslateAnimation(0,0,0,40);
        animation.setDuration(1000);
        animation.setFillAfter(true);
        animation.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {

            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        });
        imgLogoRedimed.setAnimation(animation);
        blurTransformation = new BlurTransformation(this, BLUR_RADIUS);
        backgroundImageTargetSize = calculateBackgroundImageSizeCroppedToScreenAspectRatio(
                getWindowManager().getDefaultDisplay());


        Picasso.with(this).load(R.drawable.bg_home)
        .resize(backgroundImageTargetSize.x, backgroundImageTargetSize.y).centerCrop()
        .transform(blurTransformation).into(imgBackgroundHome);


        // Initialize controls
        rippleViewPlasticInjury.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent movedToPlasticInjuryPage = new Intent(HomeActivity.this, PlasticInjuryActivity.class);
                startActivity(movedToPlasticInjuryPage);
            }
        });

        rippleViewSportInjury.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent movedToSportInjuryPage = new Intent(HomeActivity.this, SportInjuryActivity.class);
                startActivity(movedToSportInjuryPage);
            }
        });
        rippleViewOrthopaedic.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent movedToOrthopaedic = new Intent(HomeActivity.this, OrthopaedicActivity.class);
                startActivity(movedToOrthopaedic);
            }
        });
        rippleViewWorkInjury.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent movedToWorkInjuryPage = new Intent(HomeActivity.this, WorkInjuryActivity.class);
                startActivity(movedToWorkInjuryPage);
            }
        });
        rippleViewCallUs.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                Intent callIntent = new Intent(Intent.ACTION_CALL);
                callIntent.setData(Uri.parse(Config.CALLPHONE));
                startActivity(callIntent);
            }
        });
        btnFaq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent movedToFAQsPage = new Intent(HomeActivity.this, FAQActivity.class);
                startActivity(movedToFAQsPage);
            }
        });
        btnUrgentCare.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent movedToUrgentCarePage = new Intent(HomeActivity.this, UrgentCareActivity.class);
                startActivity(movedToUrgentCarePage);
            }
        });
    }

    //CreateJsonDataSuburb : if suburb.json file not exists then create file suburb.json
    public void CreateJsonDataSuburb() {
        File file = new File(getStringValue(R.string.urlFile) + getApplicationContext().getPackageName() + getStringValue(R.string.fileName));
        if(!file.exists()){
            UrgentRequestApi urgentApi = RetrofitClient.createService(UrgentRequestApi.class);
            urgentApi.getListSuburb(new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    try {
                        FileWriter file = new FileWriter(getStringValue(R.string.urlFile) + getApplicationContext().getPackageName() + getStringValue(R.string.fileName));
                        file.write(String.valueOf(jsonObject));
                        file.flush();
                        file.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void failure(RetrofitError error) {

                }
            });
        }
    }

    public String getStringValue(int id){
        return getResources().getString(id);
    }

    private static Point calculateBackgroundImageSizeCroppedToScreenAspectRatio(Display display) {
        final Point screenSize = new Point();
        getSizeCompat(display, screenSize);
        int scaledWidth = (int) (((double) BACKGROUND_IMAGES_HEIGHT * screenSize.x) / screenSize.y);
        int croppedWidth = Math.min(scaledWidth, BACKGROUND_IMAGES_WIDTH);
        int scaledHeight = (int) (((double) BACKGROUND_IMAGES_WIDTH * screenSize.y) / screenSize.x);
        int croppedHeight = Math.min(scaledHeight, BACKGROUND_IMAGES_HEIGHT);
        return new Point(croppedWidth, croppedHeight);
    }

    @SuppressWarnings("deprecation")
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private static void getSizeCompat(Display display, Point screenSize) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            display.getSize(screenSize);
        } else {
            screenSize.x = display.getWidth();
            screenSize.y = display.getHeight();
        }
    }
}
package com.redimed.telehealth.patient.utils;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.res.ResourcesCompat;
import android.support.v4.view.PagerAdapter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;

import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Lam on 11/2/2015.
 */
public class SliderImageAdapter extends PagerAdapter {

    private Activity activity;
    private List<String> listPath;
    private LayoutInflater inflater;
    private Context context;
    private int[] resourcesIMG = {
            R.drawable.slider1,
            R.drawable.slider2,
            R.drawable.slider3,
    };

    @Bind(R.id.imgSlider)
    ImageView imgSlider;

    public SliderImageAdapter(Activity activity, List<String> listPath) {
        this.activity = activity;
        this.listPath = listPath;
    }

    public SliderImageAdapter(Context context) {
        this.context = context;
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return resourcesIMG.length;
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
        return view == ((RelativeLayout) object);
    }

    @Override
    public Object instantiateItem(ViewGroup container, int position) {
        View viewLayout = inflater.inflate(R.layout.slider_image, container, false);
        ButterKnife.bind(this, viewLayout);
        imgSlider.setImageResource(resourcesIMG[position]);
        container.addView(viewLayout);

        return viewLayout;
    }

    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
        container.removeView((RelativeLayout) object);
    }
}

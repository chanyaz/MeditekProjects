package com.redimed.telehealth.patient.tracking;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.tracking.presenter.ITrackingPresenter;
import com.redimed.telehealth.patient.tracking.presenter.TrackingPresenter;
import com.redimed.telehealth.patient.tracking.view.ITrackingView;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;
import com.redimed.telehealth.patient.utlis.AdapterAppointment;
import com.redimed.telehealth.patient.utlis.EndlessRecyclerOnScrollListener;

import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class TrackingFragment extends Fragment implements ITrackingView {

    private Context context;
    private String TAG = "TRACKING";
    private ITrackingPresenter iTrackingPresenter;

    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.rvListAppointment)
    RecyclerView rvListAppointment;
    @Bind(R.id.lblNoData)
    TextView lblNoData;
    @Bind(R.id.progressBar)
    ProgressBar progressBar;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.btnBack)
    Button btnBack;

    public TrackingFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_list_appointment, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);
        getListAppointment();
        SwipeRefresh();
        return v;
    }

    private void getListAppointment() {
        iTrackingPresenter = new TrackingPresenter(context, this, getActivity());
        iTrackingPresenter.setProgressBarVisibility(View.VISIBLE);
        iTrackingPresenter.getListAppointment();
    }

    @Override
    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.list_appt_title));
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iTrackingPresenter.changeFragment(new HomeFragment());
            }
        });
    }

    @Override
    public void onSetProgressBarVisibility(int visibility) {
        progressBar.setVisibility(visibility);
    }

    //Refresh information patient
    private void SwipeRefresh() {
        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                iTrackingPresenter.getListAppointment();
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);
    }

    @Override
    public void onLoadListAppt(List<Appointment> data) {
        lblNoData.setVisibility(View.GONE);
        iTrackingPresenter.setProgressBarVisibility(View.GONE);

        int TYPE_APPOINTMENT = 1;
        final LinearLayoutManager linearLayoutManager = new LinearLayoutManager(context);
        AdapterAppointment adapterAppointment = new AdapterAppointment(context, TYPE_APPOINTMENT, getActivity());

        rvListAppointment.setHasFixedSize(true);
        rvListAppointment.setLayoutManager(linearLayoutManager);
        rvListAppointment.setAdapter(adapterAppointment);
//        rvListAppointment.setOnScrollListener(new RecyclerView.OnScrollListener() {
//            @Override
//            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
//                super.onScrollStateChanged(recyclerView, newState);
//            }
//
//            @Override
//            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
//                swipeInfo.setEnabled(linearLayoutManager.findFirstCompletelyVisibleItemPosition() == 0);
//            }
//        });
        rvListAppointment.addOnScrollListener(new EndlessRecyclerOnScrollListener(linearLayoutManager) {
            @Override
            public void onLoadMore(int current_page) {
                Log.d(TAG, current_page + "");
            }

            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                swipeInfo.setEnabled(linearLayoutManager.findFirstCompletelyVisibleItemPosition() == 0);
            }
        });

        adapterAppointment.swapDataAppointment(data);
        swipeInfo.setRefreshing(false);
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(context, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            lblNoData.setVisibility(View.VISIBLE);
            new DialogAlert(context, DialogAlert.State.Error, msg).show();
        }
        swipeInfo.setRefreshing(false);
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    iTrackingPresenter.changeFragment(new HomeFragment());
                    return true;
                }
                return false;
            }
        });
    }
}

package com.redimed.telehealth.patient;

import android.content.Intent;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.ViewFlipper;

import com.opentok.android.BaseVideoRenderer;
import com.opentok.android.OpentokError;
import com.opentok.android.Publisher;
import com.opentok.android.PublisherKit;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;
import com.opentok.android.SubscriberKit;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import butterknife.Bind;
import butterknife.ButterKnife;

public class CallActivity extends AppCompatActivity implements View.OnClickListener, PublisherKit.PublisherListener, SubscriberKit.VideoListener, Session.SessionListener {

    private String TAG = "CALL";
    private Intent i;
    private Session sessionOpenTok;
    private Publisher publisher;
    private Subscriber subscriber;
    private ArrayList<Stream> streamOpenTok;
    private static final String LOGTAG = "OpenTok";
    private String sessionId, token, apiKey, to, from;
    private static final boolean SUBSCRIBE_TO_SELF = false;

    @Bind(R.id.fabHold)
    FloatingActionButton fabHold;
    @Bind(R.id.fabEndCall)
    FloatingActionButton fabEndCall;
    @Bind(R.id.fabMute)
    FloatingActionButton fabMute;
    @Bind(R.id.publisherView)
    RelativeLayout publisherView;
    @Bind(R.id.subscriberView)
    RelativeLayout subscriberView;
    @Bind(R.id.loadingSpinner)
    ProgressBar loadingBar;
    @Bind(R.id.imgLogoCall)
    ImageView imgLogoCall;
    @Bind(R.id.btnDecline)
    FloatingActionButton btnDecline;
    @Bind(R.id.btnAnswer)
    FloatingActionButton btnAnswer;
    @Bind(R.id.vfCall)
    ViewFlipper vfCall;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        ButterKnife.bind(this);

        streamOpenTok = new ArrayList<Stream>();
        Picasso.with(getApplicationContext()).load(R.drawable.logo_bg_redimed)
                .transform(new BlurTransformation(getApplicationContext(), 15))
                .into(imgLogoCall);

        btnDecline.setOnClickListener(this);
        btnAnswer.setOnClickListener(this);
        fabEndCall.setOnClickListener(this);
        fabHold.setOnClickListener(this);
        fabMute.setOnClickListener(this);

        ListenSocket();
    }

    @Override
    protected void onStop() {
        super.onStop();
        if(sessionOpenTok != null)
            sessionOpenTok.disconnect();
    }

    @Override
    protected void onDestroy() {
        if(sessionOpenTok != null)
            sessionOpenTok.disconnect();
        super.onDestroy();
        sendBroadcast(new Intent("Restart_Socket_Service"));
    }

    //    Initialize Session ID, API Key, Token
    private void ListenSocket() {
        i = getIntent();
        if (i.getExtras() != null) {
            if (i.getExtras().getString("message").equalsIgnoreCase("call")) {
                sessionId = i.getExtras().getString("sessionId");
                token = i.getExtras().getString("token");
                apiKey = i.getExtras().getString("apiKey");
                to = i.getExtras().getString("to");
                from = i.getExtras().getString("from");
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (sessionOpenTok != null) {
            int position = vfCall.getCurrentView().getId();
            if (position == 0){
                DeclineCommunication("decline");
            }
            else {
                DeclineCommunication("end");
            }
        }
        super.onBackPressed();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case (R.id.btnDecline):
                DeclineCommunication("decline");
                break;
            case (R.id.btnAnswer):
                AnswerCommunication();
                break;
            case R.id.fabHold:
                HoldCommunication();
                break;
            case R.id.fabMute:
                MuteCommunication();
                break;
            case R.id.fabEndCall:
                DeclineCommunication("end");
                break;
        }
    }

    //    Accept appointment
    private void AnswerCommunication() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", from);
        params.put("to", to);
        params.put("message", "answer");
        try {
            SocketService.sendData("socket/messageTransfer", params);
            SessionConnect();
            vfCall.showNext();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    //    Refuse appointment
    private void DeclineCommunication(String message) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", from);
        params.put("to", to);
        params.put("message", message);
        try {
            SocketService.sendData("socket/messageTransfer", params);
            publisher = null;
            subscriber = null;
            streamOpenTok.clear();
            sessionOpenTok = null;
            startActivity(new Intent(this, MainActivity.class));
            finish();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    //Click button hold on a call
    private void HoldCommunication() {
//        publisher.setPublishVideo(!publisher.getPublishVideo());
//        if (publisher.getPublishVideo() == false) {
//            publisher.setPublishAudio(false);
//            subscriber.setSubscribeToAudio(false);
//        } else {
//            publisher.setPublishAudio(true);
//            subscriber.setSubscribeToAudio(true);
//        }
        if (publisher.getPublishVideo() == true){
            publisher.setPublishAudio(false);
            subscriber.setSubscribeToAudio(false);
            publisher.setPublishVideo(false);
            fabMute.setImageResource(R.drawable.icon_mute);
        }
        else {
            publisher.setPublishAudio(true);
            subscriber.setSubscribeToAudio(true);
            publisher.setPublishVideo(true);
            fabMute.setImageResource(R.drawable.icon_unmute);
        }
    }

    //Click button mute sound when call
    private void MuteCommunication() {
        publisher.setPublishAudio(!publisher.getPublishAudio());
        fabMute.setImageResource(publisher.getPublishAudio() ? R.drawable.icon_unmute : R.drawable.icon_mute);
    }

    //Initialize session to make connect between application and Open Tok
    private void SessionConnect() {
        if (sessionOpenTok == null) {
            sessionOpenTok = new Session(CallActivity.this, apiKey, sessionId);
            sessionOpenTok.setSessionListener(this);
            sessionOpenTok.connect(token);
        }
    }

    //Initialize view Publisher (Patient)
    private void AttachPublisherView(Publisher paramPublisher) {
        publisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        RelativeLayout.LayoutParams layoutPublisher = new RelativeLayout.LayoutParams(500, 500);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        layoutPublisher.topMargin = dpToPx(8);
        layoutPublisher.rightMargin = dpToPx(8);
        publisherView.addView(publisher.getView(), layoutPublisher);
    }

    //Initialize view Subscriber (Clinic)
    public void AttachSubscriberView(Subscriber paramSubscriber) {
        RelativeLayout.LayoutParams layoutSubscriber = new RelativeLayout.LayoutParams(
                getResources().getDisplayMetrics().widthPixels,
                getResources().getDisplayMetrics().heightPixels);
        subscriberView.addView(subscriber.getView(), layoutSubscriber);
        paramSubscriber.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
    }

    //Initialize connect with subscribe
    private void SubscribeToStream(Stream stream) {
        subscriber = new Subscriber(CallActivity.this, stream);
        subscriber.setVideoListener(this);
        sessionOpenTok.subscribe(subscriber);
        if (subscriber.getSubscribeToVideo()) {
            loadingBar.setVisibility(View.VISIBLE);
        }
    }

    //Disconnect with subscribe
    private void UnsubscribeFromStream(Stream stream) {
        streamOpenTok.remove(stream);
        if (subscriber.getStream().getStreamId().equals(stream.getStreamId())) {
            subscriberView.removeView(subscriber.getView());
            subscriber = null;
            if (!streamOpenTok.isEmpty()) {
                SubscribeToStream(streamOpenTok.get(0));
            }
        }
        DeclineCommunication("end");
    }

    @Override
    public void onConnected(Session session) {
        if (publisher == null) {
            publisher = new Publisher(CallActivity.this, "publisher");
            publisher.setPublisherListener(this);
            AttachPublisherView(publisher);
            sessionOpenTok.publish(publisher);
        }
    }

    @Override
    public void onDisconnected(Session session) {
        if (publisher != null) {
            publisherView.removeView(publisher.getView());
        }

        if (subscriber != null) {
            subscriberView.removeView(subscriber.getView());
        }

        publisher = null;
        subscriber = null;
        streamOpenTok.clear();
        sessionOpenTok = null;
    }

    @Override
    public void onStreamCreated(PublisherKit publisherKit, Stream stream) {
        if (SUBSCRIBE_TO_SELF) {
            streamOpenTok.add(stream);
            if (subscriber == null) {
                SubscribeToStream(stream);
            }
        }
    }

    @Override
    public void onStreamReceived(Session session, Stream stream) {
        if (!SUBSCRIBE_TO_SELF) {
            streamOpenTok.add(stream);
            if (subscriber == null) {
                SubscribeToStream(stream);
            }
        }
    }

    @Override
    public void onStreamDropped(Session session, Stream stream) {
        if (!SUBSCRIBE_TO_SELF) {
            if (subscriber != null) {
                UnsubscribeFromStream(stream);
            }
        }
    }

    @Override
    public void onStreamDestroyed(PublisherKit publisherKit, Stream stream) {
        if (SUBSCRIBE_TO_SELF && subscriber != null) {
            UnsubscribeFromStream(stream);
        }
    }

    @Override
    public void onError(Session session, OpentokError opentokError) {
        Log.i(LOGTAG, "Session exception: " + opentokError.getMessage());
    }


    @Override
    public void onError(PublisherKit publisherKit, OpentokError opentokError) {
        Log.i(LOGTAG, "Publisher exception: " + opentokError.getMessage());
    }

    /**
     * Converts dp to real pixels, according to the screen density.
     *
     * @param dp A number of density-independent pixels.
     * @return The equivalent number of real pixels.
     */
    private int dpToPx(int dp) {
        double screenDensity = this.getResources().getDisplayMetrics().density;
        return (int) (screenDensity * (double) dp);
    }

    @Override
    public void onVideoDataReceived(SubscriberKit subscriberKit) {
        loadingBar.setVisibility(View.GONE);
        AttachSubscriberView(subscriber);
    }

    @Override
    public void onVideoDisabled(SubscriberKit subscriberKit, String s) {

    }

    @Override
    public void onVideoEnabled(SubscriberKit subscriberKit, String s) {

    }

    @Override
    public void onVideoDisableWarning(SubscriberKit subscriberKit) {

    }

    @Override
    public void onVideoDisableWarningLifted(SubscriberKit subscriberKit) {

    }
}

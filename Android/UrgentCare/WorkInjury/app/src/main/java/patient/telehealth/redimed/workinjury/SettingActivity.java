package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class SettingActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.btnBack) LinearLayout btnBack;
    @Bind(R.id.btnLogout) RelativeLayout btnLogout;
    @Bind(R.id.lblUserName) TextView lblUserName;
    @Bind(R.id.lblCompanyName) TextView lblCompanyName;
    @Bind(R.id.layoutAccount) LinearLayout layoutAccount;
    @Bind(R.id.layoutAccountCenter) LinearLayout layoutAccountCenter;
    @Bind(R.id.layoutCompany) RelativeLayout layoutCompany;
    @Bind(R.id.lblCompany) TextView lblCompany;
    @Bind(R.id.lblAccount) TextView lblAccount;
    @Bind(R.id.layoutOther) LinearLayout layoutOther;
    @Bind(R.id.layoutAbountRedimed) RelativeLayout layoutAbountRedimed;

    private SharedPreferences workinjury;
    private boolean isAuthenticated;
    private boolean isTypeCompany;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting);
        ButterKnife.bind(this);
        workinjury = getSharedPreferences("WorkInjury", MODE_PRIVATE);
        lblUserName.setText(workinjury.getString("username","N/A"));
        lblCompanyName.setText(workinjury.getString("companyName","N/A"));
        isAuthenticated = workinjury.getBoolean("isAuthenticated", false);
        isTypeCompany = workinjury.getBoolean("isTypeCompany", false);
        if (!isAuthenticated){
            btnLogout.setVisibility(View.GONE);
            lblAccount.setVisibility(View.GONE);
            layoutAccountCenter.setVisibility(View.GONE);
        }
        Log.d("isTypeCompany",isTypeCompany+"");
        if (!isTypeCompany){
            lblCompany.setVisibility(View.GONE);
            layoutCompany.setVisibility(View.GONE);
        }
        btnBack.setOnClickListener(this);
        btnLogout.setOnClickListener(this);
        layoutAccount.setOnClickListener(this);
        layoutCompany.setOnClickListener(this);
        layoutOther.setOnClickListener(this);
        layoutAbountRedimed.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnBack:
                startActivity(new Intent(this, HomeActivity111.class));
                finish();
                break;
            case  R.id.btnLogout:
                RESTClient.getAuthApi().logout(new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        Log.d("Logout", String.valueOf(jsonObject));
                        SharedPreferences.Editor editor = workinjury.edit();
                        editor.clear();
                        editor.commit();
                        startActivity(new Intent(getApplicationContext(), HomeActivity111.class));
                        finish();
                    }

                    @Override
                    public void failure(RetrofitError error) {

                    }
                });
                break;
            case  R.id.layoutAccount:
                startActivity(new Intent(this,AccountActivity.class));
                finish();
                break;
            case R.id.layoutCompany:
                startActivity(new Intent(this, SiteListActivity.class));
                finish();
                break;
            case R.id.layoutAbountRedimed:

                break;
            case R.id.layoutOther:

                break;
        }
    }
}

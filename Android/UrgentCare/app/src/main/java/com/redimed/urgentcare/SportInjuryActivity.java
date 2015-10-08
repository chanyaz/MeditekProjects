package com.redimed.urgentcare;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.ScrollView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.redimed.urgentcare.api.UrgentRequestApi;
import com.redimed.urgentcare.models.UrgentRequestModel;
import com.redimed.urgentcare.utils.CreateDatePicker;
import com.redimed.urgentcare.utils.RetrofitClient;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class SportInjuryActivity extends AppCompatActivity implements CreateDatePicker.OnCompleteListener{
    @Bind(R.id.txtFirstName) EditText txtFirstName;
    @Bind(R.id.txtLastName) EditText txtLastName;
    @Bind(R.id.txtContactPhone) EditText txtContactPhone;
    @Bind(R.id.txtDOB) EditText txtDOB;
    @Bind(R.id.txtEmail) EditText txtEmail;
    @Bind(R.id.txtDescription) EditText txtDescription;
    @Bind(R.id.radioGroupGPReferral) RadioGroup radioGroupGPReferral;
    @Bind(R.id.radioGroupUrgentRequestType) RadioGroup radioGroupUrgentRequestType;
    @Bind(R.id.scrollViewSportInjury) ScrollView scrollViewSportInjury;
    @Bind(R.id.btnCloseSportInjuryPage) Button btnCloseSportInjuryPage;
    @Bind(R.id.btnSportInjury) Button btnSportInjury;
    @Bind(R.id.autoCompleteSuburb)
    AutoCompleteTextView autoCompleteSuburb;
    String[] surburb;
    Gson gson = new Gson();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sport_injury);
        // Initialize default values
        ButterKnife.bind(this);
        mReadJsonData();
        // Initialize controls
        EditText[] allEditTextEventOnTouchListener = {txtFirstName,txtLastName,txtDOB,txtContactPhone,txtEmail,txtDescription};
        OnTouchListenerRelativeLayout(scrollViewSportInjury, allEditTextEventOnTouchListener);
        TxtDOBCreateDatePicker(txtDOB);
        CloseMakeAppointmentPage(btnCloseSportInjuryPage);
        EditText[] allEditTextCheckRequire = {txtFirstName, txtLastName};
        SendMakeAppointment(btnSportInjury, allEditTextCheckRequire);
        EdittextValidateFocus(allEditTextCheckRequire);

    }

    public void mReadJsonData() {
        try {
            File f = new File("/data/data/" + getPackageName() + "/" + "suburb.json");
            if  (f.exists()){
                FileInputStream is = new FileInputStream(f);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);
                Log.d("roine", mResponse);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);

                surburb = gson.fromJson(obj.get("data"), String[].class);
                Log.d("nene",obj.get("data").toString());
                ArrayAdapter adapter = new ArrayAdapter(SportInjuryActivity.this,android.R.layout.simple_list_item_1,surburb);
                autoCompleteSuburb.setAdapter(adapter);
                autoCompleteSuburb.setThreshold(1);
            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    //validate all EditText when outfocus
    public void EdittextValidateFocus(EditText[] edt){
        final Drawable customErrorDrawable = getResources().getDrawable(R.drawable.ic_edittext_error);
        customErrorDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());

        //validate EditText required
        for (int i=0;i<edt.length;i++){
            final EditText editTextFocus = edt[i];
            editTextFocus.setOnFocusChangeListener(new View.OnFocusChangeListener() {
                @Override
                public void onFocusChange(View v, boolean hasFocus) {
                    if (!hasFocus) {
                        if (CheckRequiredData(editTextFocus)) {
                            editTextFocus.setError(editTextFocus.getHint()+" is required!", customErrorDrawable);
                        } else {
                            editTextFocus.setError(null);
                        }
                    }
                }
            });
        }
        //validate contact phone
        txtContactPhone.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus) {
                    if (CheckContactNo(txtContactPhone) == "null") {
                        txtContactPhone.setError("Contact Phone is required!", customErrorDrawable);
                    } else if (CheckContactNo(txtContactPhone) == "error") {
                        txtContactPhone.setError("Contact Phone wrong formatted", customErrorDrawable);
                    } else {
                        txtContactPhone.setError(null);
                    }
                }
            }
        });

        //validate email
        txtEmail.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus) {
                    if (!IsEmailValid(txtEmail) && txtEmail.getText().length() > 0) {
                        txtEmail.setError("Email address not valid", customErrorDrawable);
                    } else {
                        txtEmail.setError(null);
                    }
                }
            }
        });
    }

    //validate from
    public boolean CheckValidateFrom(EditText[] arrayEditTextCheckRequired){
        //initialize buttons
        final Drawable customErrorDrawable = getResources().getDrawable(R.drawable.ic_edittext_error);
        customErrorDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());

        boolean validate = true;
        //validation
        for (int i=0; i<arrayEditTextCheckRequired.length;i++){
            if (CheckRequiredData(arrayEditTextCheckRequired[i])) {
                arrayEditTextCheckRequired[i].setError(arrayEditTextCheckRequired[i].getHint()+" is required!", customErrorDrawable);
                validate = false;
            }else {
                arrayEditTextCheckRequired[i].setError(null);
            }
        }
        //validate phone number
        // australian phonenumer: 10digits (0X YYYY YYYY)
        if (CheckContactNo(txtContactPhone) == "null"){
            txtContactPhone.setError("Contact No is required!", customErrorDrawable);
            validate = false;
        }else if (CheckContactNo(txtContactPhone) == "error"){
            txtContactPhone.setError("Contact No wrong formatted",customErrorDrawable);
            validate = false;
        }else {
            txtContactPhone.setError(null);
        }
        //validate email format
        if (!IsEmailValid(txtEmail) && txtEmail.getText().length() > 0){
            txtEmail.setError("Email address not valid",customErrorDrawable);
            validate = false;
        }else {
            txtEmail.setError(null);
        }
        return validate;
    }
    //validate email
    public boolean IsEmailValid(EditText editText) {
        boolean isValid = false;

        String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        CharSequence inputStr = editText.getText();
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    //validate require
    public boolean CheckRequiredData(EditText editText){
        boolean isRequire = false;
        if (editText.getText().length() == 0){
            isRequire = true;
        }
        return isRequire;
    }

    //validate contact phone
    public String CheckContactNo (EditText editTextContactNo){
        if (CheckRequiredData(editTextContactNo)) {
            return "null";
        } else {
            if (editTextContactNo.getText().length() < 9){
                return "error";
            }else if (editTextContactNo.getText().length() == 9){
                int firstPhone = Integer.parseInt(editTextContactNo.getText().toString().substring(0, 1));
                if (firstPhone == 0){
                    return "error";
                }
            }else if (editTextContactNo.getText().length() == 10){
                int firstPhone = Integer.parseInt(editTextContactNo.getText().toString().substring(0, 1));
                if (firstPhone != 0){
                    return "error";
                }
            }
        }
        return "true";
    }

    public void SendMakeAppointment(Button btn, final EditText[] arr) {
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!CheckValidateFrom(arr)) {
                    return;
                }
                // Initialize objectUrgentRequest
                UrgentRequestModel objectUrgentRequest = new UrgentRequestModel();
                objectUrgentRequest.setFirstName(txtFirstName.getText().toString());
                objectUrgentRequest.setLastName(txtLastName.getText().toString());
                objectUrgentRequest.setContactPhone(
                        getResources().getString(R.string.australiaFormatPhone) + txtContactPhone.getText().toString()
                );
                objectUrgentRequest.setDOB(txtDOB.getText().toString());
                objectUrgentRequest.setEmail(txtEmail.getText().toString());
                objectUrgentRequest.setDescription(txtDescription.getText().toString());
                objectUrgentRequest.setGpReferral(((RadioButton) findViewById(radioGroupGPReferral.getCheckedRadioButtonId())).getHint().toString());
                objectUrgentRequest.setUrgentRequestType(((RadioButton) findViewById(radioGroupUrgentRequestType.getCheckedRadioButtonId())).getHint().toString());
                objectUrgentRequest.setServiceType(getResources().getString(R.string.serviceSportInjury));
                objectUrgentRequest.setSuburb(autoCompleteSuburb.getText().toString());
                // Make Appointment Process
                final SweetAlertDialog progressDialog = new SweetAlertDialog(SportInjuryActivity.this, SweetAlertDialog.PROGRESS_TYPE);
                progressDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
                progressDialog.setTitleText(getResources().getString(R.string.progressMakeAppointmentContent));
                progressDialog.setCancelable(false);
                progressDialog.show();

                //send make appointment
                Gson gson = new Gson();
                JsonObject jsonUrgentRequest = new JsonObject();
                jsonUrgentRequest.addProperty(
                        getResources().getString(R.string.jsonTitleSendAppointment),
                        gson.toJson(objectUrgentRequest)
                );

                UrgentRequestApi urgentApi = RetrofitClient.createService(UrgentRequestApi.class);
                urgentApi.sendUrgentRequest(jsonUrgentRequest, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        progressDialog.dismissWithAnimation();
                        SweetAlertDialog pDialog = new SweetAlertDialog(SportInjuryActivity.this, SweetAlertDialog.SUCCESS_TYPE);
                        pDialog.setTitleText(getResources().getString(R.string.dailogSuccess));
                        pDialog.setContentText(getResources().getString(R.string.contentDialogSuccessAppointment));
                        pDialog.setCancelable(false);
                        pDialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                            @Override
                            public void onClick(SweetAlertDialog sDialog) {
                                finish();
                            }
                        });
                        pDialog.show();
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        progressDialog.dismissWithAnimation();
                        SweetAlertDialog eDialog = new SweetAlertDialog(SportInjuryActivity.this, SweetAlertDialog.ERROR_TYPE);
                        eDialog.setTitleText(getResources().getString(R.string.dailogError));
                        eDialog.setContentText(getResources().getString(R.string.contentDialogErrorAppointment));
                        eDialog.setCancelable(false);
                        eDialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                            @Override
                            public void onClick(SweetAlertDialog sDialog) {
                                finish();
                            }
                        });
                        eDialog.show();
                    }
                });
            }
        });
    }

    //OnTouchListenerRelativeLayout
    // Hide keyboard when outfocus controls
    public void OnTouchListenerRelativeLayout(ScrollView relativeLayout,final EditText[] editTextArray){
        relativeLayout.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    for (int i = 0; i < editTextArray.length; i++) {
                        if (editTextArray[i].isFocused()) {
                            Rect outRect = new Rect();
                            editTextArray[i].getGlobalVisibleRect(outRect);
                            if (!outRect.contains((int) event.getRawX(), (int) event.getRawY())) {
                                InputMethodManager imm = (InputMethodManager) v.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                            }
                        }
                    }
                }
                return false;
            }
        });
    }

    public void CloseMakeAppointmentPage(Button btn) {
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    public void CreatePopupDatePicker(){
        CreateDatePicker datepicker = new CreateDatePicker();
        datepicker.show(getSupportFragmentManager(), "date_picker");
    }
    public void HideKeyBoard(EditText editText){
        InputMethodManager mgr = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        mgr.hideSoftInputFromWindow(editText.getWindowToken(), 0);
    }

    public void TxtDOBCreateDatePicker(final EditText editText){
        editText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    HideKeyBoard(editText);
                    CreatePopupDatePicker();
                }
            }
        });

        editText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                HideKeyBoard(editText);
                CreatePopupDatePicker();
            }
        });
    }
    public String setDate(){
        return txtDOB.getText().toString();
    }
    @Override
    public void onComplete(String date) {
        txtDOB.setText(date);
    }
}

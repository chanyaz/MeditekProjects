// Generated code from Butter Knife. Do not modify!
package patient.telehealth.redimed.sportinjury;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class SportActivity$$ViewBinder<T extends patient.telehealth.redimed.sportinjury.SportActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131493004, "field 'txtFirstName'");
    target.txtFirstName = finder.castView(view, 2131493004, "field 'txtFirstName'");
    view = finder.findRequiredView(source, 2131493007, "field 'txtLastName'");
    target.txtLastName = finder.castView(view, 2131493007, "field 'txtLastName'");
    view = finder.findRequiredView(source, 2131493010, "field 'txtContactPhone'");
    target.txtContactPhone = finder.castView(view, 2131493010, "field 'txtContactPhone'");
    view = finder.findRequiredView(source, 2131493015, "field 'txtDOB'");
    target.txtDOB = finder.castView(view, 2131493015, "field 'txtDOB'");
    view = finder.findRequiredView(source, 2131493017, "field 'txtEmail'");
    target.txtEmail = finder.castView(view, 2131493017, "field 'txtEmail'");
    view = finder.findRequiredView(source, 2131493019, "field 'txtDescription'");
    target.txtDescription = finder.castView(view, 2131493019, "field 'txtDescription'");
    view = finder.findRequiredView(source, 2131493013, "field 'autoCompleteSuburb'");
    target.autoCompleteSuburb = finder.castView(view, 2131493013, "field 'autoCompleteSuburb'");
    view = finder.findRequiredView(source, 2131493023, "field 'btnSportInjury'");
    target.btnSportInjury = finder.castView(view, 2131493023, "field 'btnSportInjury'");
    view = finder.findRequiredView(source, 2131493022, "field 'radioGroupGPReferral'");
    target.radioGroupGPReferral = finder.castView(view, 2131493022, "field 'radioGroupGPReferral'");
    view = finder.findRequiredView(source, 2131493000, "field 'btnBack'");
    target.btnBack = finder.castView(view, 2131493000, "field 'btnBack'");
    view = finder.findRequiredView(source, 2131493001, "field 'txtTitle'");
    target.txtTitle = finder.castView(view, 2131493001, "field 'txtTitle'");
    view = finder.findRequiredView(source, 2131493005, "field 'lblFNRequire'");
    target.lblFNRequire = finder.castView(view, 2131493005, "field 'lblFNRequire'");
    view = finder.findRequiredView(source, 2131493008, "field 'lblLNRequire'");
    target.lblLNRequire = finder.castView(view, 2131493008, "field 'lblLNRequire'");
    view = finder.findRequiredView(source, 2131493011, "field 'lblPhoneRequire'");
    target.lblPhoneRequire = finder.castView(view, 2131493011, "field 'lblPhoneRequire'");
  }

  @Override public void unbind(T target) {
    target.txtFirstName = null;
    target.txtLastName = null;
    target.txtContactPhone = null;
    target.txtDOB = null;
    target.txtEmail = null;
    target.txtDescription = null;
    target.autoCompleteSuburb = null;
    target.btnSportInjury = null;
    target.radioGroupGPReferral = null;
    target.btnBack = null;
    target.txtTitle = null;
    target.lblFNRequire = null;
    target.lblLNRequire = null;
    target.lblPhoneRequire = null;
  }
}

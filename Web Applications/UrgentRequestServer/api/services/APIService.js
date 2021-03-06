var API = {};
API.RootURL = 'http://testapp.redimed.com.au:3001/api';

//module urgent care
API.UrgentCareRoute = '/urgent-care';
API.UrgentCareURL = API.RootURL + API.UrgentCareRoute;

API.UrgentCareRequestRoute = API.UrgentCareRoute + '/urgent-request';
API.UrgentCareRequestURL = API.RootURL + API.UrgentCareRequestRoute;

API.UrgentCareConfirmRoute = API.UrgentCareRoute + '/urgent-confirm';
API.UrgentCareConfirmURL = API.RootURL + API.UrgentCareConfirmRoute;

module.exports = API;

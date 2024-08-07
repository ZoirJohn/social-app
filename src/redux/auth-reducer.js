import { stopSubmit } from 'redux-form';
import { authAPI, loginAPI } from '../api/api';

const SET_USER_DATA = 'auth/SET-USER-DATA';
const DELETE_USER_DATA = 'auth/DELETE-USER-DATA';
const SET_CAPTCHA = 'auth/SET-CAPTCHA';

let initialState = {
	id: null,
	login: null,
	email: null,
	password: null,
	isAuthorized: false,
	captcha: null
};

const auth_reducer = (_state = initialState, action) => {
	switch (action.type) {
		case SET_USER_DATA:
			return {
				..._state,
				id: action.id,
				login: action.login,
				email: action.email,
				isAuthorized: action.isAuthorized,
			};
		case DELETE_USER_DATA:
			return {
				..._state,
				id: null,
				login: null,
				email: null,
				isAuthorized: false,
			};
		case SET_CAPTCHA:
			return {
				..._state,
				captcha: action.url

			};
		default:
			return { ..._state };
	}
};

const setUserDataDone = (id, login, email, isAuthorized) => ({ type: SET_USER_DATA, id, login, email, isAuthorized });
const setCaptchaDone = (url) => ({ type: SET_CAPTCHA, url });

const setCaptcha = () => (dispatch) => {
	loginAPI.CAPTCHA().then(response => {
		dispatch(setCaptchaDone(response.url));
	});
};

const setUserData = () => (dispatch) => {
	authAPI.IS_REGISTERED().then((data) => {
		if (data.resultCode === 0) {
			const { id, login, email } = data.data;
			dispatch(setUserDataDone(id, login, email, true));
		}
	});
};

const sendAuthData = (email, password, captcha) => (dispatch) => {
	loginAPI.LOGIN(email, password, captcha).then(response => {
		if (response.resultCode === 0) {
			dispatch(setUserData());
		} else {
			const message = response.messages[0];
			if (response.resultCode === 10) {
				dispatch(setCaptcha());
			}
			dispatch(stopSubmit('login', { _error: message }));
		}
	});
};

const deleteAuthData = (email, password) => (dispatch) => {
	loginAPI.LOGOUT(email, password).then(response => {
		console.log(response);
		if (response.resultCode === 0) {
			dispatch(setUserDataDone(null, null, null, false));
		}
	});
};

export { auth_reducer, setUserData, sendAuthData, deleteAuthData };
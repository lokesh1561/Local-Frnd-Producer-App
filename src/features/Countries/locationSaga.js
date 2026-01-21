import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { Locationapi} from '../../api/userApi';

import {
  FETCH_COUNTRIES_REQUEST,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_FAILURE,
} from "./locationTypes";

function* fetchCountries() {
    console.log(Locationapi)
  try {
    const response = yield call(axios.get, Locationapi);
console.log(response)
    yield put({
      type: FETCH_COUNTRIES_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    yield put({
      type: FETCH_COUNTRIES_FAILURE,
      payload: error.message || error,
    });
  }
}

export default function* locationSaga() {
  yield takeLatest(FETCH_COUNTRIES_REQUEST, fetchCountries);
}

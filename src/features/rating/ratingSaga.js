import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  submitRatingSuccess,
  submitRatingFailure
} from "./ratingAction";

import { RATING_SUBMIT_REQUEST } from "./ratingType";
import { RATING_POST_URL } from "../../api/userApi"; // define your API URL

function* handleSubmitRating(action) {
  try {

    console.log("Submitting rating with payload:", action.payload);

    const token = yield call(AsyncStorage.getItem, "twittoke");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = yield call(
      axios.post,
      RATING_POST_URL,
      action.payload,
      config
    );
console.log("Rating submission response:", response);  
    yield put(submitRatingSuccess(response.data));

    if (action.callback) {
      action.callback();
    }

  } catch (error) {

    console.log("Backend error:", error.response?.data);

    yield put(
      submitRatingFailure(
        error.response?.data?.message ||
        "Rating submission failed"
      )
    );
  }
}



export default function* ratingSaga() {
  yield takeLatest(RATING_SUBMIT_REQUEST, handleSubmitRating);
}

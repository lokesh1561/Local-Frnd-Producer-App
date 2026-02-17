import {
  RATING_SUBMIT_REQUEST,
  RATING_SUBMIT_SUCCESS,
  RATING_SUBMIT_FAILURE,
  RATING_RESET
} from "./ratingType";

// Request
export const submitRatingRequest = (payload, callback) => ({
  type: RATING_SUBMIT_REQUEST,
  payload,
  callback
});


// Success
export const submitRatingSuccess = (payload) => ({
  type: RATING_SUBMIT_SUCCESS,
  payload
});

// Failure
export const submitRatingFailure = (error) => ({
  type: RATING_SUBMIT_FAILURE,
  payload: error
});

// Reset
export const resetRating = () => ({
  type: RATING_RESET
});

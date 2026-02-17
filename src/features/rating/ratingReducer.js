import {
  RATING_SUBMIT_REQUEST,
  RATING_SUBMIT_SUCCESS,
  RATING_SUBMIT_FAILURE,
  RATING_RESET
} from "./ratingType";

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null
};

const ratingReducer = (state = initialState, action) => {
  switch (action.type) {

    case RATING_SUBMIT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null
      };

    case RATING_SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        data: action.payload
      };

    case RATING_SUBMIT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case RATING_RESET:
      return initialState;

    default:
      return state;
  }
};

export default ratingReducer;

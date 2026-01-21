import {
  FETCH_COUNTRIES_REQUEST,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_FAILURE,
} from "./locationTypes";

export const fetchCountriesRequest = () => ({ type: FETCH_COUNTRIES_REQUEST });
export const fetchCountriesSuccess = (countries) => ({ type: FETCH_COUNTRIES_SUCCESS, payload: countries });
export const fetchCountriesFailure = (error) => ({ type: FETCH_COUNTRIES_FAILURE, payload: error });

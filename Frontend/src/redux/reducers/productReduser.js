import { ActionTypes } from '../constants/action-types';

const initialState = {
  userToken: '',
  clickedDate: '',
  loading: true,
};

export const aunthUser = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.USER_AUNTIFICATED:
      // return { ...state, userToken: payload, loading: false };
      return { userToken: payload };
    default:
      return state;
  }
};
export const clickDateUser = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.USER_CLICK_DATE:
      return { clickDate: payload };
    case ActionTypes.USER_ADD_EVENT:
      return { ...state, clickDate: payload };
    default:
      return state;
  }
};

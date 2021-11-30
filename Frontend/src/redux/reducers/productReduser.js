import { ActionTypes } from '../constants/action-types';

const initialState = {
  userToken: '',
  clickDate: '',
  clickedDate: '',
  addEvent: {},
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
      return { ...state, clickDate: payload };
    case ActionTypes.USER_CLICKED_DATE:
      return { ...state, clickedDate: payload };
    case ActionTypes.USER_ADD_EVENT:
      return { ...state, addEvent: payload };
    default:
      return state;
  }
};

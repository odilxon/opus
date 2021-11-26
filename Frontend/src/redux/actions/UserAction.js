import { ActionTypes } from '../constants/action-types';

export const LogInUser = (user) => {
  return {
    type: ActionTypes.USER_AUNTIFICATED,
    payload: user,
  };
};
export const HandleClickDateUser = (date) => {
  return {
    type: ActionTypes.USER_CLICK_DATE,
    payload: date,
  };
};
export const AddEvent = (date) => {
  return {
    type: ActionTypes.USER_ADD_EVENT,
    payload: date,
  };
};

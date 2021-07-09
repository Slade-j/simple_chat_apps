import { readMapConverter } from "./utils/reducerFunctions";

const SET_READ_MAP = "SET_READ_MAP";

export const setReadMap = (map) => ({
    type: SET_READ_MAP,
    payload: map
  });

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_READ_MAP: {
      return readMapConverter(action.payload);
    }
    default:
      return state;
  }
};

export default reducer;

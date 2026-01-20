import { useReducer } from "react";

import buildTextError from "../util/buildTextError";

function LoginReducer(state, action) {
  switch (action.type) {
    case "CHANGE_FIELD": {
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
        },
      };
    }
    case "SET_ERRORS": {
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          error: action.error,
        },
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}

export default function useForm(initialState, schema) {
  const [state, dispatch] = useReducer(LoginReducer, initialState);

  function handleInputChange(field, value) {
    dispatch({ type: "CHANGE_FIELD", field, value });
  }

  function handleInputValidation(field, value) {
    let errorMsg;

    if (value.trim() === "") {
      dispatch({ type: "SET_ERRORS", field, error: "" });
      return;
    }

    const validateInput = schema.shape[field].safeParse(value);

    if (!validateInput.success) {
      errorMsg = buildTextError(validateInput.error.issues[0]);
    } else {
      errorMsg = "";
    }
    dispatch({ type: "SET_ERRORS", field, error: errorMsg });
  }

  return { state, handleInputChange, handleInputValidation };
}

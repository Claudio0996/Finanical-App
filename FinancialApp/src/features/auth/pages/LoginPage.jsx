import { useReducer } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Icon from "@mui/material/Icon";

import { loginThunk } from "../authThunks";
import { clearLoginError } from "../authSlice";
import loginSchema from "../loginSchema";

const initialState = {
  email: {
    value: "",
    error: "",
  },
  password: {
    value: "",
    error: "",
  },
};

function loginReducer(state, action) {
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
    case "SET_FIELD_ERROR": {
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          error: action.error,
        },
      };
    }

    case "SET_ALL_ERRORS": {
      const newState = {};
      for (const field of Object.keys(state)) {
        newState[field] = {
          ...state[field],
          error: action.errors[field] ?? "",
        };
      }

      return newState;
    }

    default: {
      return state;
    }
  }
}

export default function LoginPage() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const authDispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.loginError);
  const loginStatus = useSelector((state) => state.auth.loginStatus);

  function handleLoginSubmit(event) {
    event.preventDefault();

    const errorObject = {};
    const payloadData = {
      email: state.email.value,
      password: state.password.value,
    };

    const payloadValidation = loginSchema.safeParse(payloadData);

    if (!payloadValidation.success) {
      for (const error of validationData.error.issues) {
        errorObject[error.path[0]] = error.message;
      }
      return dispatch({ type: "SET_ALL_ERRORS", errors: errorObject });
    }

    return authDispatch(loginThunk(payloadData));
  }

  function handleInputChange(value, field) {
    return dispatch({ type: "CHANGE_FIELD", field, value });
  }

  function handleClearError(field) {
    return dispatch({ type: "SET_FIELD_ERROR", field, error: "" });
  }

  function handleInputValidation(field) {
    const fieldValidation = loginSchema.shape[field].safeParse(state[field].value);

    if (!fieldValidation.success) {
      return dispatch({ type: "SET_FIELD_ERROR", field, error: fieldValidation.error.issues[0].message });
    }
    return dispatch({ type: "SET_FIELD_ERROR", field, error: "" });
  }

  function handleClearLoginError() {
    return authDispatch(clearLoginError());
  }

  const closeAction = (
    <Icon fontSize="small" aria-label="close" onClick={handleClearLoginError} sx={{ cursor: "pointer" }}>
      x
    </Icon>
  );
  return (
    <div className="flex flex-col gap-5 p-8 justify-center w-full ">
      <img src="/Logo.svg" alt="Logo da Ferramenta" className="w-28 md:w-28  self-center" />
      <div className="flex flex-col gap-1 items-center">
        <h1 className="font-semibold text-1xl md:text-[1.25rem]">Formulário de cadastro</h1>
        <p className="font-light text-[#111827] text-[10px] md:text-[1rem]">Acesse sua conta no SafeInvest</p>
      </div>
      <form className="w-full" onSubmit={handleLoginSubmit}>
        <div className="flex flex-col gap-6 items-start">
          <TextField
            name="email"
            label="Email"
            size="small"
            required
            fullWidth
            type="email"
            color="secondary"
            value={state.email.value}
            error={!!state.email.error}
            helperText={state.email.error}
            onChange={(event) => {
              handleClearError(event.target.name);
              handleInputChange(event.target.value, event.target.name);
            }}
            onBlur={(event) => {
              handleInputValidation(event.target.name);
            }}
          />
          <TextField
            name="password"
            label="Senha"
            size="small"
            required
            fullWidth
            type="password"
            color="secondary"
            value={state.password.value}
            error={!!state.password.error}
            helperText={state.password.error}
            onChange={(event) => {
              handleClearError(event.target.name);
              handleInputChange(event.target.value, event.target.name);
            }}
            onBlur={(event) => {
              handleInputValidation(event.target.name);
            }}
          />
          <Button
            size="medium"
            variant="contained"
            color="secondary"
            fullWidth
            disabled={loginStatus === "loading"}
            type="submit"
          >
            Entrar
          </Button>
        </div>
      </form>

      <div className="w-full text-center">
        <p className="text-[#111827]">
          Ainda não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>

      {loginError && (
        <Snackbar
          open={Boolean(loginError)}
          autoHideDuration={5000}
          onClose={handleClearLoginError}
          action={closeAction}
        >
          <Alert severity="error" variant="filled">
            {loginError}
            {closeAction}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

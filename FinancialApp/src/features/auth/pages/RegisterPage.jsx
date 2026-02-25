import { useReducer } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Icon from "@mui/material/Icon";

import { registerThunk } from "../authThunks";
import { clearRegisterError } from "../authSlice";
import registerSchema from "../registerSchema";

const initialState = {
  email: {
    value: "",
    error: "",
  },
  name: {
    value: "",
    error: "",
  },
  password: {
    value: "",
    error: "",
  },
  passwordConfirmation: {
    value: "",
    error: "",
  },
};

function formReducer(state, action) {
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

export default function RegisterPage() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const authDispatch = useDispatch();

  const registerStatus = useSelector((state) => state.auth.registerStatus);
  const registerError = useSelector((state) => state.auth.registerError);

  function handleRegisterSubmit(event) {
    event.preventDefault();

    const errorObject = {};

    const payloadData = {
      name: state.name.value,
      email: state.email.value,
      password: state.password.value,
      passwordConfirmation: state.passwordConfirmation.value,
    };

    const validationData = registerSchema.safeParse(payloadData);

    if (!validationData.success) {
      for (const error of validationData.error.issues) {
        errorObject[error.path[0]] = error.message;
      }

      return dispatch({ type: "SET_ALL_ERRORS", errors: errorObject });
    }

    return authDispatch(registerThunk(payloadData));
  }

  function handleInputChange(value, field) {
    return dispatch({ type: "CHANGE_FIELD", field, value });
  }

  function handleInputValidation(field) {
    const fieldValidation = registerSchema.shape[field].safeParse(state[field].value);

    if (!fieldValidation.success) {
      return dispatch({ type: "SET_FIELD_ERROR", field, error: fieldValidation.error.issues[0].message });
    }
    return dispatch({ type: "SET_FIELD_ERROR", field, error: "" });
  }

  function handleClearError(field) {
    return dispatch({ type: "SET_FIELD_ERROR", field, error: "" });
  }

  function handleClearRegisterError() {
    return authDispatch(clearRegisterError());
  }

  const closeAction = (
    <Icon fontSize="small" aria-label="close" onClick={handleClearRegisterError} sx={{ cursor: "pointer" }}>
      x
    </Icon>
  );

  return (
    <div className="flex flex-col gap-5 p-8 justify-center w-full ">
      <img src="/Logo.svg" alt="Logo da Ferramenta" className="w-28 md:w-28  self-center" />
      <div className="flex flex-col gap-1 items-center">
        <h1 className="font-semibold text-1xl md:text-[1.25rem]">Formulário de cadastro</h1>
        <p className="font-light text-[#111827] text-[10px] md:text-[1rem]">Crie sua conta no SafeInvest</p>
      </div>
      <form className="w-full" onSubmit={handleRegisterSubmit}>
        <div className="flex flex-col gap-6 items-start">
          <TextField
            label="Nome"
            name="name"
            size="small"
            fullWidth
            required
            type="text"
            color="secondary"
            error={!!state.name.error}
            helperText={state.name.error}
            onChange={(event) => {
              handleClearError(event.target.name);
              handleInputChange(event.target.value, event.target.name);
            }}
            onBlur={(event) => {
              handleInputValidation(event.target.name);
            }}
            value={state.name.value}
          />
          <TextField
            label="Email"
            name="email"
            size="small"
            fullWidth
            required
            type="email"
            color="secondary"
            error={!!state.email.error}
            helperText={state.email.error}
            onChange={(event) => {
              handleClearError(event.target.name);
              handleInputChange(event.target.value, event.target.name);
            }}
            onBlur={(event) => {
              handleInputValidation(event.target.name);
            }}
            value={state.email.value}
          />
          <TextField
            label="Senha"
            name="password"
            size="small"
            fullWidth
            required
            type="password"
            color="secondary"
            error={!!state.password.error}
            helperText={state.password.error}
            onChange={(event) => {
              handleClearError(event.target.name);
              handleInputChange(event.target.value, event.target.name);
            }}
            onBlur={(event) => {
              handleInputValidation(event.target.name);
            }}
            value={state.password.value}
          />
          <TextField
            label="Confirme a Senha"
            name="passwordConfirmation"
            size="small"
            fullWidth
            required
            type="password"
            color="secondary"
            error={!!state.passwordConfirmation.error}
            helperText={state.passwordConfirmation.error}
            onChange={(event) => {
              handleClearError(event.target.name);
              handleInputChange(event.target.value, event.target.name);
            }}
            onBlur={(event) => {
              handleInputValidation(event.target.name);
            }}
            value={state.passwordConfirmation.value}
          />
          <Button
            size="medium"
            variant="contained"
            color="secondary"
            fullWidth
            disabled={registerStatus === "loading"}
            type="submit"
          >
            Cadastre-se
          </Button>
        </div>
      </form>
      <div className="w-full text-center">
        <p className="text-[#111827]">
          Já tem uma conta? <Link to="/">Entre aqui.</Link>
        </p>
      </div>

      {registerError && (
        <Snackbar
          open={Boolean(registerError)}
          autoHideDuration={5000}
          onClose={handleClearRegisterError}
          action={closeAction}
        >
          <Alert severity="error" variant="filled">
            {registerError}
            {closeAction}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

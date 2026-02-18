import { useReducer } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { Link } from "react-router";

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
  confirmPassword: {
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
    default: {
      return {
        ...state,
      };
    }
  }
}

export default function RegisterPage() {
  function handleRegisterSubmit() {}

  return (
    <div className="flex flex-col gap-5 p-8 justify-center w-full ">
      <img src="/Logo.svg" alt="Logo da Ferramenta" className="w-28 md:w-28" />
      <div className="flex flex-col gap-1 ">
        <h1 className="font-semibold text-1xl md:text-[1.25rem]">Formulário de cadastro</h1>
        <p className="font-light text-[#111827] text-[10px] md:text-[1rem]">Crie sua conta no SafeInvest</p>
      </div>
      <form className="w-full" onSubmit={handleRegisterSubmit}>
        <div className="flex flex-col gap-6 items-start">
          <TextField label="Nome" name="name" size="small" fullWidth required type="text" color="secondary" />
          <TextField label="Email" name="email" size="small" fullWidth required type="email" color="secondary" />
          <TextField label="Senha" name="password" size="small" fullWidth required type="password" color="secondary" />
          <TextField
            label="Confirme a Senha"
            name="passwordConfirmation"
            size="small"
            fullWidth
            required
            type="password"
            color="secondary"
          />
          <Button size="medium" variant="contained" color="secondary" fullWidth>
            Cadastre-se
          </Button>
        </div>
      </form>
      <div className="w-full text-center">
        <p className="text-[#111827]">
          Já tem uma conta? <Link to="/login">Entre aqui.</Link>
        </p>
      </div>
    </div>
  );
}

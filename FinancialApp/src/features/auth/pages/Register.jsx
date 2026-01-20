import { useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import RegisterSchema from "../schemas/RegisterPayloadSchema";
import useRegisterForm from "../hooks/useForm";
import { registerThunk } from "../context/registerThunk";
import { clearRegisterError } from "../context/AuthContext";

const initialState = {
  name: {
    value: "",
    error: "",
  },
  email: {
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

export default function RegisterPage() {
  const { state, handleInputChange, handleInputValidation } = useRegisterForm(initialState, RegisterSchema);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const authStatus = authState.authStatus;
  const registerError = authState.registerError;

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      registerThunk({
        name: state.name.value,
        email: state.email.value,
        password: state.password.value,
        confirmPassword: state.confirmPassword.value,
      })
    );
  }

  function handleCleanError() {
    dispatch(clearRegisterError());
  }

  useEffect(() => {
    if (authStatus === "authenticated") navigate("/");
  }, [authStatus]);

  return (
    <section className="w-screen h-screen flex bg-[#f8fafc] justify-center items-center">
      <div className=" hidden md:block w-1/2 bg-[url('/background-image-login.png')] bg-custom bg-center h-full rounded-r-4xl"></div>
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="max-w-129">
          <div className="flex flex-col gap-10">
            <div>
              <img src="/Logo.svg" className="max-w-40"></img>
            </div>
            <div className="flex flex-col gap-3 max-w-[90%]">
              <h1 className="font-semibold text-2xl md:text-4xl">Crie seu cadastro</h1>
              <p className="font-light text-[#111827] text-[10px] md:text-[1rem]">
                Entre para ter um acompanhamento completo das suas finanças e investimentos
              </p>
            </div>

            <form method="post" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 items-start">
                <TextField
                  id="outlined-basic"
                  label="Nome"
                  name="nome"
                  variant="outlined"
                  type="text"
                  size="medium"
                  error={!!state.name.error}
                  helperText={state.name.error}
                  fullWidth
                  onChange={(event) => {
                    if (registerError) {
                      handleCleanError();
                    }
                    handleInputChange("name", event.target.value);
                  }}
                  onBlur={(event) => {
                    handleInputValidation("name", event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Email"
                  name="email"
                  variant="outlined"
                  type="email"
                  size="medium"
                  error={!!state.email.error}
                  helperText={state.email.error}
                  fullWidth
                  onChange={(event) => {
                    if (registerError) {
                      handleCleanError();
                    }
                    handleInputChange("email", event.target.value);
                  }}
                  onBlur={(event) => {
                    handleInputValidation("email", event.target.value);
                  }}
                />
                {}
                <TextField
                  id="outlined-basic"
                  label="Senha"
                  name="password"
                  variant="outlined"
                  type="password"
                  size="medium"
                  error={!!state.password.error}
                  helperText={state.password.error}
                  fullWidth
                  onChange={(event) => {
                    if (registerError) {
                      handleCleanError();
                    }
                    handleInputChange("password", event.target.value);
                  }}
                  onBlur={(event) => {
                    handleInputValidation("password", event.target.value);
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Confirmar Senha"
                  name="confirmPassword"
                  variant="outlined"
                  type="password"
                  size="medium"
                  error={!!state.confirmPassword.error}
                  helperText={state.confirmPassword.error}
                  fullWidth
                  onChange={(event) => {
                    if (registerError) {
                      handleCleanError();
                    }
                    handleInputChange("confirmPassword", event.target.value);
                  }}
                  onBlur={(event) => {
                    handleInputValidation("confirmPassword", event.target.value);
                  }}
                />

                {registerError?.errors?.length > 0 && (
                  <ul className="flex flex-col gap-0 text-red-400 list-none text-[12px]">
                    {registerError?.errors?.map((error) => (
                      <li key={error.message}>{error.message}</li>
                    ))}
                  </ul>
                )}

                <div className="w-full flex justify-left">
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={
                      !!state.name.error ||
                      !!state.email.error ||
                      !!state.password.error ||
                      !!state.confirmPassword.error
                    }
                    type="submit"
                  >
                    Criar Conta
                  </Button>
                </div>
              </div>
            </form>
            <div className="flex justify-center">
              <p>
                Já tem uma conta? <Link to="/login">Entrar</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

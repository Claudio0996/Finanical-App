import { useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import LoginSchema from "../schemas/LoginPayloadSchema";
import useLoginForm from "../hooks/useForm";
import { loginThunk } from "../context/loginThunk";
import { clearLoginError } from "../context/AuthContext";

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

export default function LoginPage() {
  const { state, handleInputChange, handleInputValidation } = useLoginForm(initialState, LoginSchema);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const loginError = authState.loginError;
  const authStatus = authState.authStatus;

  function handleCleanError() {
    dispatch(clearLoginError());
  }

  function handelSubmit(e) {
    e.preventDefault();
    dispatch(loginThunk({ email: state.email.value, password: state.password.value }));
  }

  useEffect(() => {
    if (authStatus === "authenticated") navigate("/");
  }, [authStatus]);

  return (
    <section className=" w-screen  h-screen bg-[#f8fafc] flex justify-center items-center">
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="max-w-129">
          <div className="flex flex-col gap-10 p-8">
            <div>
              <img src="/Logo.svg" className="max-w-40"></img>
            </div>
            <div className="flex flex-col gap-3 max-w-[90%]">
              <h1 className="font-semibold text-2xl md:text-4xl">Bem vindo de volta</h1>
              <p className="font-light text-[#111827] text-[10px] md:text-[1rem]">
                Entre para ter um acompanhamento completo das suas finanças e investimentos
              </p>
            </div>

            <form method="post" onSubmit={handelSubmit}>
              <div className="flex flex-col gap-6 items-start">
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
                    if (loginError) {
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
                    if (loginError) {
                      handleCleanError();
                    }
                    handleInputChange("password", event.target.value);
                  }}
                  onBlur={(event) => {
                    handleInputValidation("password", event.target.value);
                  }}
                />

                {loginError && <p className="text-red-400 mb-4">{loginError}</p>}

                <div className="w-full flex justify-left">
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={!!state.email.error || !!state.password.error}
                    type="submit"
                  >
                    Acessar
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="flex justify-center">
            <p>
              Não tem uma conta? <Link to="/register">Registre-se</Link>
            </p>
          </div>
        </div>
      </div>
      <div className=" hidden md:block w-1/2 bg-[url('/background-image-login.png')] bg-custom bg-center h-full rounded-l-4xl"></div>
    </section>
  );
}

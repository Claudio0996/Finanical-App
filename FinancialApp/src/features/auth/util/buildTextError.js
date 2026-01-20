export default function buildTextError(err) {
  console.log(err);
  if (err.code === "invalid_format" && err.format === "email") {
    return "E-mail inválido";
  }
}

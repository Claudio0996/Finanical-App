export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-3.5 p-8 ">
      <img src="/Logo.svg" alt="Logo da Ferramenta" className="w-20 md:w-24" />
      <div className="flex flex-col gap-3 max-w-[70%] justify-center">
        <h1 className="font-semibold text-2xl md:text-3xl">Crie seu cadastro</h1>
        <p className="font-light text-[#111827] text-[10px] md:text-[1rem]">
          Entre para ter um acompanhamento completo das suas finanças e investimentos
        </p>
      </div>
    </div>
  );
}

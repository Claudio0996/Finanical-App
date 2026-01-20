export default function Button({ type, children, onClick, className }) {
  return (
    <button type={type} className={className} onClick={onClick} disabled>
      {children}
    </button>
  );
}

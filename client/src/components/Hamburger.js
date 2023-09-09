export default function Hamburger({ onClick }) {
  return (
    <div className="hamburger-icon" onClick={onClick}>
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
    </div>
  );
}

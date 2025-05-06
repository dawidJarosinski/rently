import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="text-4xl font-Fredoka bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] text-transparent bg-clip-text">
      <Link to="/">Rently</Link>
    </div>
  );
};

export default Logo;
interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-bold text-gray-900">
          Savory Circuits
        </span>
        <span className="text-xs sm:text-sm text-gray-500">
          Discover. Cook. Savor. Repeat.
        </span>
      </div>
    </div>
  );
};

export default Logo;

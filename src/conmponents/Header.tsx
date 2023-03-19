const Header = () => {
  return (
    <div className="mt-5 text-white">
      <div className="flex text-4xl items-center gap-2 flex-col sm:flex-row">
        <span className="flex items-center gap-2 font-bold w-[220px]">
          <img src="/ChatGPT.png" width="50" className="inline-block" />
          ChatGPT
        </span>
        <span>×</span>
        <span className="flex items-center gap-2 font-bold w-[220px]">
          <img src="/StackBlitz.png" width="50" className="inline-block" />
          StackBlitz
        </span>
      </div>
    </div>
  );
};
export default Header;

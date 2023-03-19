import Image from 'next/image'

const Header = () => {
  return (
    <div className="mt-5 text-white">
      <div className="flex text-4xl items-center gap-2 flex-col sm:flex-row">
        <span className="flex items-center gap-2 font-bold w-[220px]">
          <Image src="/ChatGPT.png" width={50} height={50} className="inline-block" alt=""/>
          ChatGPT
        </span>
        <span>×</span>
        <span className="flex items-center gap-2 font-bold w-[220px]">
          <Image src="/StackBlitz.png" width={50} height={50} className="inline-block" alt=""/>
          StackBlitz
        </span>
      </div>
    </div>
  );
};
export default Header;

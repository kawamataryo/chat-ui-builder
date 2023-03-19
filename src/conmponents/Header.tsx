import Image from 'next/image'

const Header = () => {
  return (
    <div className="mt-5 text-white">
      <div className="flex text-4xl items-center gap-2 flex-col sm:flex-row">
        <span className="flex items-center gap-2 font-bold">
          <Image src="/logo.png" width={50} height={50} className="inline-block" alt=""/>
          Speak With God Now!
        </span>
      </div>
    </div>
  );
};
export default Header;

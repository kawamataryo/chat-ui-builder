const CoverImage = () => (
  <div className="absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none opacity-40">
    <div className="w-[108rem] flex-none flex justify-end">
      <picture>
        <source srcSet="/background.avif" type="image/avif" />
        <img
          src="/background.png"
          alt=""
          className="w-[71.75rem] flex-none max-w-none dark:hidden"
          decoding="async"
        ></img>
      </picture>
      <picture>
        <source srcSet="/background.avif" type="image/avif" />
        <img
          src="/background.png"
          alt=""
          className="w-[90rem] flex-none max-w-none hidden dark:block"
          decoding="async"
        />
      </picture>
    </div>
  </div>
);

export default CoverImage;

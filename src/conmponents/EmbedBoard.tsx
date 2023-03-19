//import { EMBED_TARGET_ID } from "@/utils/constants";

type Props = {
  loading: boolean;
};

const EmbedBoard = ({ loading }: Props) => {
  return (
    <>
      <div className="" id={EMBED_TARGET_ID}>
        <p className="p-4 bg-gray-100 rounded-lg">Embed will go here</p>
      </div>
      {loading && (
        <div className="absolute bg-[rgba(0,0,0,0.6)] inset-0 h-full w-full grid content-center justify-center">
          <img src="spin.svg" width="100"></img>
        </div>
      )}
    </>
  );
};
export default EmbedBoard;

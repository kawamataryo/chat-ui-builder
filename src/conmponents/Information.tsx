type Props = {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  t: (key: string) => string;
};
const Information = ({ apiKey, setApiKey, t }: Props) => {
  return (
    <div className="mt-8 text-white grid sm:grid-cols-2 gap-5">
      <div>
        <p className="text-2xl font-bold">✨ Features</p>
        <p className="mt-2">
          {t('information.features.description')}
        </p>
        <p className="mt-3">
          <a
            href=""
            className="link link-info"
          >
           
          </a>
        </p>
      </div>
     
          />
        </div>
      </div>
    </div>
  );
};
export default Information;

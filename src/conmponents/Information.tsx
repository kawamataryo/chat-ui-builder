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
          <a href="https://www.speakwithgodnow.com/"
            className="link link-info">
            Learn more about our mission
          </a>
        </p>
      </div>
      <div>
        <p className="text-2xl font-bold"></p>
        <p className="mt-2">
          {t('information.setting.description')}
        </p>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-50">
              
              <span className="text-xs text-gray-400 ml-3">
                 {t('information.setting.notice')}
              </span>
            </span>
          </label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            className="input input-bordered input-sm !bg-gray-100 !text-gray-900  max-w-[300px]"
            placeholder="***"
          />
        </div>
      </div>
    </div>
  );
};
export default Information;

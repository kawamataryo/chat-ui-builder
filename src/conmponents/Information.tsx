type Props = {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
};
const Information = ({ apiKey, setApiKey }: Props) => {
  return (
    <div className="mt-8 text-white grid sm:grid-cols-2 gap-5">
      <div>
        <p className="text-2xl font-bold">✨ Features</p>
        <p className="mt-2">
          ChatGPTとStackBlitzを使って、チャットで作りたいものを入力すると、StackBlitz上で実現してくれるツールです。実装は全て以下リポジトリで公開しています。
        </p>
        <p className="mt-3"><a href="https://github.com/kawamataryo/chatgpt-stackblitz-playground" className="link link-info">kawamataryo/chatgpt-stackblitz-playground</a></p>
      </div>
      <div>
        <p className="text-2xl font-bold">🛠️ Setting</p>
        <p className="mt-2">
          OpenAI の API Key を設定してください。入力されたAPI Keyを使って、ChatGPT
          APIと連携します。
        </p>
        <div className="form-control max-w-[300px]">
          <label className="label">
            <span className="label-text text-gray-50">API Key</span>
          </label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            className="input input-bordered input-sm !bg-gray-100 !text-gray-900"
            placeholder="*****************"
          />
        </div>
        <span className="text-xs text-gray-400">
          ※ API Keyは保存されません。ChatGPT APIの利用のみに使われます。
        </span>
      </div>
    </div>
  );
};
export default Information;

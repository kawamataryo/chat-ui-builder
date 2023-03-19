type Props = {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
}
const Setting = ({apiKey, setApiKey}: Props) => {
  return (
    <div className="mt-5 text-white">
      <p className="text-2xl font-bold">🛠️ How to use</p>
      <p className="mt-2">
        OpenAI API Keyを入力してください。入力されたAPI
        Keyを使って、ChatGPT APIと連携します。
      </p>
      <span className="text-xs text-gray-400">※ API Keyは保存されません。ChatGPT APIの利用のみに使われます。詳細は<a href="">StackBlitz上のコード</a>を確認してください。</span>

      <div className="form-control max-w-[300px]">
        <label className="label">
          <span className="label-text text-gray-50">API Key</span>
        </label>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          type="password"
          className="input input-bordered input-sm !bg-gray-100 !text-gray-900"
          placeholder=""
        />
      </div>
    </div>
  );
};
export default Setting;

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import TablePanel from "./ui/molecules/mol-table-panel";

export const experimental_ppr = true;

export default function App () {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LfEx5EqAAAAAN3Ri6bU8BynXkRlTqh6l6mHbl4t">
      <div className="items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1>Root Page.tsx</h1>
        <TablePanel />
      </div>
    </GoogleReCaptchaProvider>
  );
}

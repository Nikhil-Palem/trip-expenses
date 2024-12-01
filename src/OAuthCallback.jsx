import { useSearchParams } from "react-router-dom";

function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Send the code to your backend for token exchange
    console.log("Authorization Code:", code);

    return <div>OAuth Callback Handled</div>;
}
export default OAuthCallback
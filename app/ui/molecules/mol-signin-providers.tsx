import FacebookSignIn from "../atoms/atom-facebook-signin";
import GoogleSignIn from "../atoms/atom-google-signin";

export default function SignInProviders () {
    return (
        <>
            <p>Or signin with your provider</p>
            <GoogleSignIn />
            <FacebookSignIn />
        </>
    )
}
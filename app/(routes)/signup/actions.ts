'use server'
import { arePasswordsConfirmed, isInputValid } from "@/app/lib/utils";

export async function SignUpAction (formData: FormData) {
    console.log(formData.get('recaptcha_token'))
    /*
    if (isInputValid(formData).ok && arePasswordsConfirmed(formData)) {
        const body = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                token,
                name: formData.get('name'),
                username: formData.get('username'),
                birthday: formData.get('birthday'),
                email: formData.get("email"),
                password: formData.get("password"),
            })
        })

        const response = await body.json();
        console.log(response);
        
    }*/

    return {
        message: 'Sign up failed'
    }
}
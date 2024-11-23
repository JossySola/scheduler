import { Action_State } from "@/app/lib/definitions";
import { isInputValid } from "@/app/lib/utils";

export async function SignUpAction (prevState: Action_State, formData: FormData) {
    console.log(isInputValid(formData))
}
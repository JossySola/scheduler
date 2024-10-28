'use server'

export async function printAction (formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    console.log(data)
}
export async function Page() {
    return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <section>
              <h2>Thank you for signing up!</h2>
              <p>Check your email to confirm</p>
              
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to confirm your account
                before signing in.
              </p>
          </section>
        </div>
      </div>
    </div>
    )
}
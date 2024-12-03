export default function VerifyEmail() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-gray-600 mb-4">
          We&apos;ve sent you an email with a verification link. Please check your inbox and click the link to verify your account.
        </p>
        <p className="text-sm text-gray-500">
          After verifying your email, you can return to the{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            login page
          </a>
        </p>
      </div>
    </div>
  )
}

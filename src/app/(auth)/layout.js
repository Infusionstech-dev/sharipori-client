export default function AuthLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <div className="rounded-lg border border-soft bg-white p-6">{children}</div>
    </div>
  );
}

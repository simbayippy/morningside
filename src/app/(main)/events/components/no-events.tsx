export function NoEvents({ message }: { message: string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

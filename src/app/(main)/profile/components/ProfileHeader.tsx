interface ProfileHeaderProps {
  title: string;
  description: string;
}

export function ProfileHeader({ title, description }: ProfileHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="font-mono text-4xl font-bold text-gray-900">{title}</h1>
      <p className="mt-4 text-lg text-gray-600">{description}</p>
    </div>
  );
}

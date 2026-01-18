type Props = {
  title: string;
  children: React.ReactNode;
};

export default function InfoCard({ title, children }: Props) {
  return (
    <div className="rounded-xl bg-neutral-900 p-4">
      <h4 className="text-sm mb-2 text-neutral-300">{title}</h4>
      <div className="text-sm space-y-1">{children}</div>
    </div>
  );
}

export default function OfferingStats({ data }: any) {
  const total = data.reduce((acc: number, o: any) => acc + o.amount, 0);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold">Total Offerings</h2>
      <p className="text-2xl font-bold mt-2">R{total}</p>
    </div>
  );
}
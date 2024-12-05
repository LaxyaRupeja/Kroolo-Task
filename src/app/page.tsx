import UpdateNode from "./nodes";

export default function Home() {
  return (
  <div className="items-center justify-items-center p-10 min-h-screen font-[family-name:var(--font-geist-sans)]">
    <h1 className="text-white text-4xl font-bold mb-4">
      Kroolo Task - By Laxya
    </h1>
      <div className="w-full">
      <UpdateNode />
      </div>
    </div>
  );
}

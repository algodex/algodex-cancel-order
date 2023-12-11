import Image from "next/image";
export default function Instructions() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2 className="text-2xl font-semibold mb-4 text-left">Instructions</h2>
      <Image
        width={1100}
        height={0}
        src="/cancel-order-mainnet.jpg"
        alt="instructions"
      ></Image>
    </main>
  );
}

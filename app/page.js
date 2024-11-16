import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>Levi</h2>
      <Link href={`dashboard`}>
        <Button variant="default">Dashboard</Button>
      </Link>
      <Link href={`lee`}>
        <Button variant="default">Ackermann</Button>
      </Link>
    </div>
  );
}

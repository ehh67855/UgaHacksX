import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAuthToken, getLogin } from "@/services/BackendService";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const authToken = await getAuthToken();
  const userLogin = await getLogin(authToken);
  if (userLogin) {
    redirect("/feed");
  }

  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="/background.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome!</h1>
          <p className="text-xl md:text-2xl mb-6">
            Your Sound, Your Archive – Store and Share Your Musical Journey.
          </p>
          <p className="text-lg md:text-xl mb-8">
            Please log in or sign up to continue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

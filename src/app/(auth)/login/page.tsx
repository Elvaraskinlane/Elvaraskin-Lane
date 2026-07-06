import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login - Elvara Skinlane",
};

export default function LoginPage() {
  return (
    <main className="flex-grow flex items-center justify-center min-h-screen">
      <div className="w-full max-w-[1280px] mx-auto md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 min-h-screen md:min-h-[800px]">
        {/* Image Section */}
        <div className="hidden md:block relative bg-surface-container-low h-full w-full overflow-hidden">
          <Image
            src="/hero-1.png"
            alt="Minimalist skincare bottle"
            fill
            priority
            className="object-cover transition-transform duration-[20s] ease-out hover:scale-105"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent"></div>
        </div>
        
        {/* Form Section */}
        <LoginForm />
      </div>
    </main>
  );
}

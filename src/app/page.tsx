import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="max-w-4xl space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-foreground drop-shadow-sm leading-tight">
          Seamless Billing for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
            Shreeram Nursery
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mx-auto max-w-2xl leading-relaxed font-medium">
          Create, manage, and track your invoices with our modern platform.
          Built for speed, security, and simplicity.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
              Get Started for Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur-sm border-2">
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

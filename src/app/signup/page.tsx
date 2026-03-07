import { AuthForm } from "@/components/AuthForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="flex-1 flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute inset-0 flex items-center justify-center dark:bg-black/80 bg-white/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            <AuthForm type="signup" />
        </div>
    );
}

import Signup from "@/components/Admin/Signup";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-center text-2xl font-semibold mb-6">
                    List Your Event and Get Payment with Solana
                </h1>
                <Signup />
            </div>
        </div>
    );
}

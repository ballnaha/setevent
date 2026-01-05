import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center relative overflow-hidden bg-background">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-tertiary/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />

            {/* Main Content */}
            <div className="relative z-10 space-y-6 max-w-lg mx-auto">
                <h1 className="text-[120px] md:text-[180px] font-bold leading-none font-comfortaa text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-tertiary select-none drop-shadow-sm">
                    404
                </h1>

                <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground font-prompt">
                        ไม่พบหน้าที่คุณต้องการ
                    </h2>
                    <p className="text-gray-500 font-prompt text-sm md:text-base leading-relaxed">
                        ขออภัย หน้าที่คุณกำลังมองหาอาจถูกย้าย เปลี่ยนชื่อ หรือไม่มีอยู่จริงในระบบ
                        กรุณาตรวจสอบลิงก์อีกครั้งหรือกลับไปที่หน้าหลัก
                    </p>
                </div>

                <div className="pt-8 flex justify-center">
                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-prompt font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span>กลับสู่หน้าหลัก</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                        >
                            <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

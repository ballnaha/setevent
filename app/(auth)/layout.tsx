import { Box } from "@mui/material";

export const metadata = {
    title: "เข้าสู่ระบบ (Login) - SetEvent Admin",
    description: "ระบบจัดการหลังบ้าน SetEvent",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#0f172a',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Image / Decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.3,
                    filter: 'blur(8px)',
                }}
            />

            {/* Overlay Gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9))',
                }}
            />

            {/* Decorative Blobs */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(10, 92, 90, 0.4) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 10s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translate(0, 0)' },
                        '50%': { transform: 'translate(50px, 50px)' },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 8s ease-in-out infinite reverse',
                }}
            />

            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '450px', px: 2 }}>
                {children}
            </Box>
        </Box>
    );
}

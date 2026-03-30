"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Stack,
    CircularProgress,
    Divider,
    InputAdornment
} from "@mui/material";
import { Location, Call, Sms, Message, Facebook, Instagram, Youtube, Save2 } from "iconsax-react";
import TopSnackbar from "@/components/ui/TopSnackbar";

interface ContactSettings {
    address: string;
    phone: string;
    email: string;
    line: string;
    lineUrl: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    mapUrl: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
    address: "",
    phone: "",
    email: "",
    line: "",
    lineUrl: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    mapUrl: ""
};

export default function ContactSettingsPage() {
    const [settings, setSettings] = useState<ContactSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings/contact");
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings/contact", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setSnackbar({ open: true, message: "บันทึกข้อมูลสำเร็จ", severity: "success" });
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            setSnackbar({ open: true, message: "เกิดข้อผิดพลาดในการบันทึก", severity: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof ContactSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // If updating mapUrl and value looks like an iframe tag, extract the src
        if (field === "mapUrl" && value.includes("<iframe")) {
            const match = value.match(/src="([^"]*)"/);
            if (match && match[1]) {
                value = match[1];
            }
        }

        setSettings({ ...settings, [field]: value });
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                    Contact Settings
                </Typography>
                <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save2 size="20" color="white" />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ fontFamily: 'var(--font-prompt)', bgcolor: 'var(--primary)' }}
                >
                    {saving ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Contact Information */}
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Location size="24" color="var(--primary)" variant="Bulk" />
                        ข้อมูลติดต่อ
                    </Typography>

                    <Stack spacing={3}>
                        <TextField
                            label="ที่อยู่"
                            fullWidth
                            multiline
                            rows={3}
                            value={settings.address}
                            onChange={handleChange("address")}
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                        <TextField
                            label="เบอร์โทรศัพท์"
                            fullWidth
                            value={settings.phone}
                            onChange={handleChange("phone")}
                            placeholder="081-234-5678"
                            InputProps={{
                                sx: { fontFamily: 'var(--font-prompt)' },
                                startAdornment: <Call size="18" color="rgba(0,0,0,0.4)" style={{ marginRight: 8 }} />
                            }}
                        />
                        <TextField
                            label="อีเมล"
                            fullWidth
                            type="email"
                            value={settings.email}
                            onChange={handleChange("email")}
                            placeholder="contact@example.com"
                            InputProps={{
                                sx: { fontFamily: 'var(--font-prompt)' },
                                startAdornment: <Sms size="18" color="rgba(0,0,0,0.4)" style={{ marginRight: 8 }} />
                            }}
                        />
                        <Divider />
                        <TextField
                            label="LINE ID"
                            fullWidth
                            value={settings.line}
                            onChange={handleChange("line")}
                            placeholder="@setevent"
                            InputProps={{
                                sx: { fontFamily: 'var(--font-prompt)' },
                                startAdornment: <Message size="18" color="rgba(0,0,0,0.4)" style={{ marginRight: 8 }} />
                            }}
                        />
                        <TextField
                            label="LINE URL"
                            fullWidth
                            value={settings.lineUrl}
                            onChange={handleChange("lineUrl")}
                            placeholder="https://line.me/ti/p/~@setevent"
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                    </Stack>
                </Paper>

                {/* Social Media */}
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Facebook size="24" color="var(--primary)" variant="Bulk" />
                        Social Media
                    </Typography>

                    <Stack spacing={3}>
                        <TextField
                            label="Facebook URL"
                            fullWidth
                            value={settings.facebook}
                            onChange={handleChange("facebook")}
                            placeholder="https://facebook.com/seteventthailand"
                            InputProps={{
                                sx: { fontFamily: 'var(--font-prompt)' },
                                startAdornment: <Facebook size="18" color="rgba(0,0,0,0.4)" style={{ marginRight: 8 }} />
                            }}
                        />
                        <TextField
                            label="Instagram URL"
                            fullWidth
                            value={settings.instagram}
                            onChange={handleChange("instagram")}
                            placeholder="https://instagram.com/yourpage"
                            InputProps={{
                                sx: { fontFamily: 'var(--font-prompt)' },
                                startAdornment: <Instagram size="18" color="rgba(0,0,0,0.4)" style={{ marginRight: 8 }} />
                            }}
                        />
                        <TextField
                            label="TikTok URL"
                            fullWidth
                            value={settings.tiktok}
                            onChange={handleChange("tiktok")}
                            placeholder="https://tiktok.com/@yourpage"
                            InputProps={{ 
                                sx: { fontFamily: 'var(--font-prompt)' },
                                startAdornment: (
                                    <InputAdornment position="start" style={{ marginRight: 8 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(0,0,0,0.4)"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            label="YouTube Channel URL"
                            fullWidth
                            value={settings.youtube}
                            onChange={handleChange("youtube")}
                            placeholder="https://youtube.com/@yourchannel"
                            InputProps={{
                                sx: { fontFamily: 'var(--font-prompt)' },
                                startAdornment: <Youtube size="18" color="rgba(0,0,0,0.4)" style={{ marginRight: 8 }} />
                            }}
                        />
                        <Divider />
                        <TextField
                            label="Google Maps Embed URL"
                            fullWidth
                            multiline
                            rows={2}
                            value={settings.mapUrl}
                            onChange={handleChange("mapUrl")}
                            placeholder="https://www.google.com/maps/embed?..."
                            helperText="URL สำหรับ embed Google Maps (optional)"
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                    </Stack>
                </Paper>
            </Box>

            {/* Preview Section */}
            <Paper sx={{ mt: 4, p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 3 }}>
                    Preview
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, textAlign: 'center' }}>
                        <Location size="28" color="var(--primary)" variant="Bulk" />
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mt: 1 }}>ที่อยู่</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem', opacity: 0.7, mt: 0.5 }}>
                            {settings.address || "-"}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, textAlign: 'center' }}>
                        <Call size="28" color="var(--primary)" variant="Bulk" />
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mt: 1 }}>โทรศัพท์</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem', opacity: 0.7, mt: 0.5 }}>
                            {settings.phone || "-"}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, textAlign: 'center' }}>
                        <Sms size="28" color="var(--primary)" variant="Bulk" />
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mt: 1 }}>อีเมล</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem', opacity: 0.7, mt: 0.5 }}>
                            {settings.email || "-"}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, textAlign: 'center' }}>
                        <Message size="28" color="var(--primary)" variant="Bulk" />
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mt: 1 }}>LINE</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem', opacity: 0.7, mt: 0.5 }}>
                            {settings.line || "-"}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, textAlign: 'center' }}>
                        <Youtube size="28" color="var(--primary)" variant="Bulk" />
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mt: 1 }}>YouTube</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem', opacity: 0.7, mt: 0.5 }}>
                            {settings.youtube ? "ตั้งค่าแล้ว" : "-"}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Snackbar */}
            <TopSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Box>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    CircularProgress,
    Fade,
    Paper,
    IconButton
} from "@mui/material";
import { Cup, User, Send2, Refresh2, CloseCircle, Heart, Crown } from "iconsax-react";

interface Score {
    id: string;
    name: string;
    score: number;
    createdAt: string;
}

interface LeaderboardProps {
    slug: string;
    currentScore: number;
    gameDuration: number;
    onClose: () => void;
}

export default function Leaderboard({ slug, currentScore, gameDuration, onClose }: LeaderboardProps) {
    const [scores, setScores] = useState<Score[]>([]);
    const [name, setName] = useState("");
    const [savedName, setSavedName] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [userRank, setUserRank] = useState<number | null>(null);

    // Persistent Player ID & Name in localStorage
    useEffect(() => {
        let pId = localStorage.getItem("valentine_player_id");
        if (!pId) {
            pId = 'val_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("valentine_player_id", pId);
        }

        const storedName = localStorage.getItem("valentine_player_name");
        if (storedName) {
            setName(storedName);
            setSavedName(storedName);
        }
    }, []);

    const fetchScores = async () => {
        setIsLoading(true);
        try {
            const pId = localStorage.getItem("valentine_player_id");
            const response = await fetch(`/api/valentine/${slug}/score?playerId=${pId || ''}`);
            if (response.ok) {
                const data = await response.json();
                setScores(data.scores || []);
                setTotalPlayers(data.totalPlayers || 0);
                setUserRank(data.userRank || null);

                // Verify if player exists in DB
                const stored = localStorage.getItem("valentine_player_name");
                if (stored) {
                    // Check userRank instead of top 10 list
                    const existsInDb = !!data.userRank;

                    if (!existsInDb && !hasSubmitted) {
                        // If user truly doesn't exist in DB at all, clear local data
                        localStorage.removeItem("valentine_player_name");
                        setSavedName(null);
                        setName("");
                        setIsEditingName(true);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch scores:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
    }, [slug]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName || isSubmitting) return;

        const pId = localStorage.getItem("valentine_player_id");

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const response = await fetch(`/api/valentine/${slug}/score`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    playerId: pId,
                    name: trimmedName,
                    score: currentScore,
                    duration: gameDuration
                }),
            });

            if (response.ok) {
                localStorage.setItem("valentine_player_name", trimmedName);
                setSavedName(trimmedName);
                setIsEditingName(false);
                setHasSubmitted(true);
                // Fetch scores again to show updated rank
                fetchScores();
            } else {
                const errorData = await response.json();
                setSubmitError(errorData.error || "ไม่สามารถส่งคะแนนได้ กรุณาลองใหม่");
                // If it's a name conflict, we might want to let them edit
                if (response.status === 409) {
                    setIsEditingName(true);
                    setSavedName(null);
                }
            }
        } catch (error) {
            console.error("Failed to submit score:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetName = () => {
        localStorage.removeItem("valentine_player_name");
        setSavedName(null);
        setName("");
        setIsEditingName(true);
    };

    return (
        <Box className="leaderboard-view" sx={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            bgcolor: '#FDF2F4', // Soft pink background for the whole page
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
        }}>
            {/* Header */}
            <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, #FF3366 0%, #D41442 100%)',
                color: 'white',
                position: 'relative'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        p: 1,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        display: 'flex'
                    }}>
                        <Cup size="32" variant="Bold" color="#FFD700" />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'var(--font-mali)', lineHeight: 1.2 }}>
                            ตารางอันดับหัวใจ
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, fontFamily: 'var(--font-mali)', letterSpacing: '0.05em' }}>
                            RANKING LEADERBOARD
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: 'white',
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' }
                    }}
                >
                    <CloseCircle variant="Outline" size="24" color="white" />
                </IconButton>
            </Box>

            <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1, position: 'relative', minHeight: 0 }}>
                {/* Score Submission */}
                {!hasSubmitted && (
                    <Fade in={!hasSubmitted}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                mb: 3,
                                bgcolor: '#FFF5F7',
                                borderRadius: '1.5rem',
                                border: '2px solid #FFE4E9',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.05 }}>
                                <Heart size="80" variant="Bold" color="#FF3366" />
                            </Box>

                            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                {isLoading ? (
                                    <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <CircularProgress size={30} sx={{ color: '#FF3366' }} />
                                        <Typography sx={{ fontSize: '0.8rem', color: '#666', fontFamily: 'var(--font-mali)' }}>
                                            กำลังตรวจสอบคะแนนของคุณ...
                                        </Typography>
                                    </Box>
                                ) : (() => {
                                    const pId = typeof window !== 'undefined' ? localStorage.getItem("valentine_player_id") : null;
                                    const userInTop = scores.find(s => (s as any).playerId === pId || (savedName && s.name === savedName));
                                    const isHigher = userInTop ? currentScore > userInTop.score : currentScore > 0;

                                    // 1. New Player with No Score yet
                                    if (currentScore <= 0 && !userInTop) {
                                        return (
                                            <Box sx={{ py: 2 }}>
                                                <Typography sx={{ fontWeight: 800, color: '#8B1D36', fontFamily: 'var(--font-mali)', fontSize: '0.9rem', mb: 1 }}>
                                                    ยังไม่มีคะแนนเลย! ❤️
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#666', fontFamily: 'var(--font-mali)' }}>
                                                    พยายามเก็บหัวใจให้ได้เพื่อติดอันดับนะ!
                                                </Typography>
                                            </Box>
                                        );
                                    }

                                    // 2. Returning Player (Homepage or No New High Score)
                                    if (userInTop && !isHigher && savedName) {
                                        return (
                                            <Box sx={{ py: 1 }}>
                                                <Typography sx={{ fontWeight: 800, color: '#8B1D36', fontFamily: 'var(--font-mali)', fontSize: '0.9rem', mb: 1 }}>
                                                    {currentScore > 0 ? "พยายามอีกนิด! ❤️" : `ยินดีต้อนรับกลับมา, ${savedName}! ❤️`}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#666', fontFamily: 'var(--font-mali)' }}>
                                                    {currentScore > 0
                                                        ? <>คะแนนครั้งนี้ยังไม่ทำลายสถิติเดิมของคุณ (<b>{userInTop.score.toLocaleString()}</b> แต้ม)</>
                                                        : <>คะแนนสูงสุดของคุณคือ <b>{userInTop.score.toLocaleString()}</b> แต้ม</>
                                                    }
                                                </Typography>
                                            </Box>
                                        );
                                    }

                                    // 3. Allow submission (First time or Higher score)
                                    return (
                                        <>
                                            {isHigher && currentScore > 0 && (
                                                <Box sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    px: 1.5,
                                                    py: 0.4,
                                                    bgcolor: '#FF3366',
                                                    color: 'white',
                                                    borderRadius: '50px',
                                                    mb: 1.5,
                                                    boxShadow: '0 4px 12px rgba(255, 51, 102, 0.3)',
                                                    animation: 'pulse 2s infinite'
                                                }}>
                                                    <Crown size="14" variant="Bold" color="#FFD700" />
                                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, fontFamily: 'var(--font-mali)', letterSpacing: '0.05em' }}>
                                                        NEW HIGH SCORE!
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Typography sx={{ mb: 1, fontWeight: 800, color: '#D41442', fontFamily: 'var(--font-mali)', fontSize: '0.9rem' }}>
                                                {!savedName && userInTop ? "คุณต้องการเปลี่ยนชื่อเป็น? ✍️" : isHigher ? "ว้าว! สถิติใหม่ของคุณ 🌟" : "ส่งคะแนนรักของคุณ! ❤️"}
                                            </Typography>

                                            {currentScore > 0 && (
                                                <Typography sx={{
                                                    mb: 2,
                                                    fontWeight: 900,
                                                    color: isHigher ? '#FF3366' : '#8B1D36',
                                                    fontFamily: 'var(--font-mali)',
                                                    fontSize: isHigher ? '2.2rem' : '1.6rem',
                                                    lineHeight: 1,
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    {currentScore.toLocaleString()} <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 700 }}>แต้ม</Box>
                                                </Typography>
                                            )}

                                            {savedName ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
                                                    <Typography sx={{ fontSize: '0.85rem', color: '#6A1B1B', fontFamily: 'var(--font-mali)' }}>
                                                        ส่งในนาม: <b>{savedName}</b>
                                                    </Typography>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={() => handleSubmit()}
                                                        disabled={isSubmitting}
                                                        sx={{
                                                            borderRadius: '50px',
                                                            bgcolor: '#FF3366',
                                                            fontFamily: 'var(--font-mali)',
                                                            boxShadow: '0 4px 12px rgba(255, 51, 102, 0.3)',
                                                            '&:hover': { bgcolor: '#D41442' }
                                                        }}
                                                    >
                                                        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "อัปเดตคะแนนใหม่ 🚀"}
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                                                    <TextField
                                                        autoFocus
                                                        fullWidth
                                                        placeholder="ใส่ชื่อของคุณ..."
                                                        variant="outlined"
                                                        size="small"
                                                        value={name}
                                                        onChange={(e) => {
                                                            setName(e.target.value);
                                                            setSubmitError(null);
                                                        }}
                                                        disabled={isSubmitting}
                                                        error={!!submitError}
                                                        helperText={submitError}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '50px',
                                                                bgcolor: 'white',
                                                                fontFamily: 'var(--font-mali)',
                                                                fontSize: '0.9rem',
                                                                '& fieldset': { borderColor: submitError ? '#d32f2f' : '#FFC1CC' },
                                                            },
                                                            '& .MuiFormHelperText-root': {
                                                                fontFamily: 'var(--font-mali)',
                                                                mx: 2
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={isSubmitting || !name.trim()}
                                                        sx={{
                                                            borderRadius: '50px',
                                                            bgcolor: '#FF3366',
                                                            minWidth: '54px',
                                                            '&:hover': { bgcolor: '#D41442' },
                                                        }}
                                                    >
                                                        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send2 size="22" variant="Bold" color="#FFFFFF" />}
                                                    </Button>
                                                </form>
                                            )}
                                        </>
                                    );
                                })()}
                            </Box>
                        </Paper>
                    </Fade>
                )}

                {hasSubmitted && (
                    <Fade in={hasSubmitted}>
                        <Box sx={{
                            textAlign: 'center',
                            py: 2,
                            mb: 2,
                            bgcolor: '#F0FDF4',
                            borderRadius: '1rem',
                            border: '1px solid #DCFCE7',
                            color: '#16A34A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                        }}>
                            <Typography sx={{ fontWeight: 800, fontFamily: 'var(--font-mali)', fontSize: '0.9rem' }}>ส่งคะแนนสำเร็จแล้ว! 🎉</Typography>
                        </Box>
                    </Fade>
                )}

                {/* Leaderboard List */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                    <Box sx={{ mb: 2, px: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#8B112D', fontFamily: 'var(--font-mali)' }}>
                            Top 10 อันดับสูงสุด
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={fetchScores}
                            disabled={isLoading}
                            sx={{
                                bgcolor: '#FFF',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                '&:hover': { bgcolor: '#FFE4E9' }
                            }}
                        >
                            <Refresh2 size="18" color="#FF3366" variant="Bold" className={isLoading ? 'animate-spin' : ''} />
                        </IconButton>
                    </Box>

                    {isLoading && scores.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={40} thickness={4} sx={{ color: '#FF3366' }} />
                        </Box>
                    ) : scores.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#F9FAFB', borderRadius: '1rem' }}>
                            <Typography variant="body2" sx={{ color: '#9CA3AF', fontFamily: 'var(--font-mali)', fontWeight: 500 }}>ยังไม่มีอันดับคะแนนในขณะนี้</Typography>
                        </Box>
                    ) : (
                        <List disablePadding sx={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                            {scores.map((s, index) => (
                                <React.Fragment key={s.id}>
                                    <ListItem
                                        sx={{
                                            px: 1,
                                            py: 1.5,
                                            borderRadius: '12px',
                                            transition: 'background-color 0.2s',
                                            '&:hover': { bgcolor: '#F9FAFB' }
                                        }}
                                    >
                                        <ListItemAvatar sx={{ minWidth: 52, position: 'relative' }}>
                                            {index < 3 && (
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: -12,
                                                    left: 19,
                                                    transform: 'translateX(-50%) rotate(-15deg)',
                                                    zIndex: 1,
                                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                                                    animation: `crownFloat 2s ease-in-out infinite`,
                                                    animationDelay: `${index * 0.3}s`
                                                }}>
                                                    <Crown
                                                        size="20"
                                                        variant="Bold"
                                                        color={index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32"}
                                                    />
                                                </Box>
                                            )}
                                            <Avatar sx={{
                                                bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#E5E7EB' : index === 2 ? '#FDBA74' : 'white',
                                                border: index < 3 ? 'none' : '2px solid #FFE4E9',
                                                color: index === 0 ? '#854D0E' : index === 1 ? '#4B5563' : index === 2 ? '#9A3412' : '#FF3366',
                                                fontWeight: 900,
                                                width: 38,
                                                height: 38,
                                                fontSize: '1rem',
                                                fontFamily: 'var(--font-mali)',
                                                boxShadow:
                                                    index === 0 ? '0 0 15px rgba(255, 215, 0, 0.4)' :
                                                        index === 1 ? '0 0 12px rgba(192, 192, 192, 0.3)' :
                                                            index === 2 ? '0 0 10px rgba(205, 127, 50, 0.2)' : 'none'
                                            }}>
                                                {index + 1}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={s.name}
                                            primaryTypographyProps={{
                                                fontWeight: 800,
                                                sx: { color: index === 0 ? '#8B112D' : '#4A151B', fontFamily: 'var(--font-mali)', fontSize: '1rem' }
                                            }}
                                        />
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography sx={{ fontWeight: 900, color: '#FF3366', fontSize: '1.1rem', fontFamily: 'var(--font-mali)' }}>
                                                {s.score.toLocaleString()}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.65rem', color: '#9CA3AF', fontFamily: 'var(--font-mali)', fontWeight: 700 }}>แต้ม</Typography>
                                        </Box>
                                    </ListItem>
                                    {index < scores.length - 1 && <Divider variant="inset" component="li" sx={{ my: 0.5, opacity: 0.5 }} />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}

                    {/* User Specific Rank (If outside top 10) */}
                    {!isLoading && userRank && userRank > 10 && (
                        <Box sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: 'rgba(255, 51, 102, 0.05)',
                            border: '1px dashed #FFC1CC',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: '#FFF', color: '#FF3366', fontWeight: 900, fontSize: '0.9rem', width: 32, height: 32, border: '1px solid #FFC1CC' }}>
                                    {userRank}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#8B112D', fontFamily: 'var(--font-mali)' }}>
                                        คุณ {savedName}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.65rem', color: '#666', fontFamily: 'var(--font-mali)' }}>
                                        จากผู้เล่นทั้งหมด {totalPlayers.toLocaleString()} คน
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF3366', fontFamily: 'var(--font-mali)', bgcolor: '#FFF', px: 1.5, py: 0.5, borderRadius: '20px' }}>
                                อันดับที่ {userRank}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* CSS Animation */}
            <style jsx>{`
                .leaderboard-container {
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    backface-visibility: hidden;
                    transform: translateZ(0);
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes crownFloat {
                    0%, 100% { transform: translateX(-50%) rotate(-15deg) translateY(0); }
                    50% { transform: translateX(-50%) rotate(-15deg) translateY(-3px); }
                }
            `}</style>
        </Box>
    );
}

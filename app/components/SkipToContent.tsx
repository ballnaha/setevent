"use client";

import React from "react";

export default function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="skip-to-content"
            style={{
                position: 'absolute',
                left: '-9999px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
            }}
            onFocus={(e) => {
                e.currentTarget.style.position = 'fixed';
                e.currentTarget.style.top = '10px';
                e.currentTarget.style.left = '10px';
                e.currentTarget.style.width = 'auto';
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.padding = '12px 24px';
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.zIndex = '9999';
                e.currentTarget.style.borderRadius = '8px';
                e.currentTarget.style.fontFamily = 'var(--font-prompt)';
                e.currentTarget.style.fontWeight = '600';
                e.currentTarget.style.textDecoration = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            }}
            onBlur={(e) => {
                e.currentTarget.style.position = 'absolute';
                e.currentTarget.style.left = '-9999px';
                e.currentTarget.style.width = '1px';
                e.currentTarget.style.height = '1px';
            }}
        >
            ข้ามไปยังเนื้อหาหลัก
        </a>
    );
}

'use client';

import React, { useEffect } from 'react';

interface CrispnessGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CrispnessGuideModal({ isOpen, onClose }: CrispnessGuideModalProps) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && isOpen) onClose();
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
            <div
                className="relative w-full max-w-lg rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="guide-modal-title"
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Close crispness guide"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Modal Content */}
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                    <span>🛡️ Artisanal Care Guide</span>
                </div>
                <h3 id="guide-modal-title" className="text-2xl font-bold font-display text-stone-900 mb-3">
                    How to Preserve Peak Crunch
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                    Because we refuse to use chemical preservatives or anti-caking agents, our snacks interact with air just like homemade food. Follow these 4 craft rules:
                </p>

                <div className="space-y-4">
                    {[
                        {
                            num: '01',
                            title: 'Transfer to an Airtight Metal Tin or Glass Jar',
                            desc: 'Once opened, transfer remaining snacks from the craft pouch to an airtight container with a tight rubber gasket.',
                        },
                        {
                            num: '02',
                            title: 'Never Store Inside the Refrigerator',
                            desc: 'Cold air introduces moisture and condensation, causing rice flour spirals and banana chips to soften rapidly.',
                        },
                        {
                            num: '03',
                            title: 'Shield from Direct Kitchen Steam',
                            desc: 'Keep storage tins away from boiling kettles, rice cookers, or dishwashers.',
                        },
                        {
                            num: '04',
                            title: 'The 2-Minute Monsoon Crunch Revival',
                            desc: 'If Bangalore monsoon humidity softens your murukku, toast lightly in a warm dry pan or preheated oven (100°C) for 2 minutes to restore full snap.',
                        },
                    ].map((step) => (
                        <div key={step.num} className="flex items-start gap-3.5 p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                            <span className="text-xs font-bold font-mono text-amber-600 px-2 py-1 rounded-md bg-amber-50 shrink-0">
                                {step.num}
                            </span>
                            <div>
                                <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                                    {step.title}
                                </h4>
                                <p className="text-xs text-stone-600 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">
                        Covered under our 30-Day Crispness Guarantee
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer active:scale-95"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

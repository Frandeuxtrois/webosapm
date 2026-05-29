import React, { useRef, useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import headerLogo from '../assets/headerlogo.png';
import html2canvas from 'html2canvas';

interface CredencialData {
    nombreCompleto: string;
    nroCarnet: string;
    documento: number;
    planNombre: string;
    fechaVencimiento: string;
    gravado: string;
}

interface CredencialProps {
    data: CredencialData[];
    token: string;
    loading: boolean;
    onRefresh: () => void;
}

const CARD_W = 600;
const CARD_H = 340;

export const Credencial: React.FC<CredencialProps> = ({ data, token, loading, onRefresh }) => {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () => {
            if (containerRef.current) {
                const w = containerRef.current.offsetWidth;
                setScale(Math.min(1, w / CARD_W));
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const handleDownload = async (index: number, nombre: string) => {
        const el = cardRefs.current[index];
        if (!el) return;

        
        const clone = el.cloneNode(true) as HTMLElement;
        clone.style.transform = 'none';
        clone.style.position  = 'fixed';
        clone.style.top       = '-9999px';
        clone.style.left      = '-9999px';
        clone.style.width     = '600px';
        clone.style.height    = '340px';
        document.body.appendChild(clone);

        const DPR = 3;
        const cardCanvas = await html2canvas(clone, { scale: DPR, useCORS: true, backgroundColor: '#ffffff' });
        document.body.removeChild(clone);

        const padding = 80;
        const r = 28 * DPR; 
        const x = padding;
        const y = padding;
        const w = cardCanvas.width;
        const h = cardCanvas.height;

        const final = document.createElement('canvas');
        final.width  = w + padding * 2;
        final.height = h + padding * 2;
        const ctx = final.getContext('2d')!;

        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, final.width, final.height);

        
        const rrect = (cx: number, cy: number, cw: number, ch: number, cr: number) => {
            ctx.beginPath();
            ctx.moveTo(cx + cr, cy);
            ctx.lineTo(cx + cw - cr, cy);
            ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + cr);
            ctx.lineTo(cx + cw, cy + ch - cr);
            ctx.quadraticCurveTo(cx + cw, cy + ch, cx + cw - cr, cy + ch);
            ctx.lineTo(cx + cr, cy + ch);
            ctx.quadraticCurveTo(cx, cy + ch, cx, cy + ch - cr);
            ctx.lineTo(cx, cy + cr);
            ctx.quadraticCurveTo(cx, cy, cx + cr, cy);
            ctx.closePath();
        };

        
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.20)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = '#ffffff';
        rrect(x, y, w, h, r);
        ctx.fill();
        ctx.restore();

        
        ctx.save();
        rrect(x, y, w, h, r);
        ctx.clip();
        ctx.drawImage(cardCanvas, x, y);
        ctx.restore();

        const link = document.createElement('a');
        link.download = `carnet-${nombre.replace(/\s+/g, '_')}.png`;
        link.href = final.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in duration-500 font-sans">


            <div ref={containerRef} className="flex flex-col gap-8 w-full items-center">
                {data.map((item, index) => {
                    const [apellido, nombres] = item.nombreCompleto.split(',').map(s => s.trim());

                    return (
                        <div key={index} className="flex flex-col items-center gap-3 w-full">

                            <div style={{
                                width: CARD_W * scale,
                                height: CARD_H * scale,
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}>

                            <div
                                ref={(el) => { cardRefs.current[index] = el; }}
                                className="w-[600px] h-[340px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
                            >


                                <div className="h-4 bg-[#39B5E6]"></div>


                                <div className="bg-white h-[90px] flex items-center justify-center px-8">
                                    <img
                                        src={headerLogo}
                                        className="h-[60px] object-contain"
                                        alt="OSAPM"
                                    />
                                </div>


                                <div className="h-[7px] bg-[#39B5E6]"></div>


                                <div className="h-1 bg-white"></div>


                                <div className="h-[1px] bg-[#39B5E6]"></div>


                                <div className="flex-1 bg-[#39B5E6] px-8 py-6 flex justify-between items-start">


                                    <div className="flex-1">
                                        <div className="mb-3">
                                            <h3 className="text-[28px] font-black leading-tight uppercase text-black">
                                                {apellido},
                                            </h3>
                                            {nombres && (
                                                <h4 className="text-[24px] font-black leading-tight uppercase text-black">
                                                    {nombres}
                                                </h4>
                                            )}
                                        </div>

                                        <div className="space-y-0.5">
                                            <p className="text-[16px] font-extrabold text-black">
                                                {item.nroCarnet} D.N.I. {item.documento}
                                            </p>
                                            <p className="text-[16px] font-extrabold uppercase text-black">
                                                VENCIMIENTO: {item.fechaVencimiento}
                                            </p>
                                        </div>
                                    </div>


                                    <div className="flex flex-col justify-between items-end h-full">
                                        <div className="text-right">
                                            <p className="text-[30px] font-black leading-none uppercase text-black mb-1">
                                                {item.planNombre}
                                            </p>
                                            <p className="text-[13px] font-black uppercase text-black">
                                                {item.gravado}
                                            </p>
                                        </div>

                                    </div>
                                </div>


                                <div className="h-2 bg-[#39B5E6]"></div>
                            </div>
                            </div>


                            <button
                                onClick={() => handleDownload(index, item.nombreCompleto)}
                                className="flex items-center gap-2 px-4 py-2 border border-[#00AEEF] text-[#00AEEF] rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#00AEEF] hover:text-white transition-all"
                            >
                                <Download size={12} />
                                Descargar carnet
                            </button>
                        </div>
                    );
                })}
            </div>

            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.4em] opacity-60 mt-2">
                Credencial Digital • Uso Oficial OSAPM
            </p>
        </div>
    );
};
import React, { useState, useRef, useCallback } from 'react';
import { 
  BarChart3, History, Settings, Upload, Share2, 
  Save, Play, Loader2, X, CheckCircle2, AlertCircle 
} from 'lucide-react';

// --- COMPONENTES AUXILIARES DE ESTILO ---

const ActionButton = ({ children, onClick, variant = 'primary', disabled = false, loading = false }) => {
  const variants = {
    primary: "bg-[#00c896] text-black hover:brightness-110 shadow-[0_0_20px_rgba(0,200,150,0.2)]",
    secondary: "bg-[#262626] text-white hover:bg-[#323232]",
    outline: "bg-[#054a3a] text-[#00c896] hover:bg-[#085a47] border border-[#00c896]/20",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : children}
    </button>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function VisionAIApp() {
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Manipulação de Arquivos
  const handleFiles = (files) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onButtonClick = () => fileInputRef.current.click();

  // Simulação da Lógica de IA (Baseado no Prompt do MVP)
  const simulateAnalysis = () => {
    if (!image) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      // Aqui entraria a chamada real para base44.integrations.Core.InvokeLLM
      setResult({
        direction: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
        confidence: Math.floor(Math.random() * (98 - 82 + 1) + 82),
        asset: "EUR/USD (OTC)",
        timeframe: "M5"
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 p-4 sm:p-8 font-sans selection:bg-[#00c896]/30">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex items-center justify-between p-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-[#00c896]/10 border border-[#00c896]/30 rounded-2xl flex items-center justify-center">
                <div className="w-3 h-3 bg-[#00c896] rounded-full shadow-[0_0_15px_#00c896] animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">VISION AI</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Análise Gráfica</span>
                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                <span className="text-[10px] font-bold text-[#00c896]">V3.0 FLASH</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-[#141414] rounded-xl border border-white/5 hover:bg-[#1f1f1f]">
            <Settings size={20} className="text-gray-400" />
          </button>
        </header>

        {/* STATUS CARD */}
        <div className="bg-[#111] p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#00c896] rounded-full shadow-[0_0_8px_#00c896]" />
            <span className="text-xs font-bold uppercase tracking-tighter text-gray-400">Sistema Operacional</span>
          </div>
          <span className="text-[10px] font-mono text-[#00c896]/70">SERVER_ID: 0x44B</span>
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-[#141414] p-6 rounded-[2.5rem] border border-white/5 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c896]/20 to-transparent" />
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white">Upload do gráfico</h2>
            <p className="text-xs text-gray-500 px-4">Identifique oportunidades de entrada em segundos.</p>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFiles(e.target.files)} 
            accept="image/*" 
            className="hidden" 
          />

          <ActionButton onClick={onButtonClick}>
            ENVIAR PRINT
          </ActionButton>

          {/* DROPZONE */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`
              relative min-h-[180px] border-2 border-dashed rounded-[2rem] transition-all cursor-pointer
              flex flex-col items-center justify-center p-4
              ${dragActive ? 'border-[#00c896] bg-[#00c896]/5' : 'border-white/10 bg-black/20 hover:bg-black/40'}
              ${image ? 'border-[#00c896]/40' : ''}
            `}
          >
            {image ? (
              <div className="relative group w-full h-full flex justify-center">
                <img src={image} alt="Preview" className="max-h-32 rounded-xl object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                  <p className="text-xs font-bold">TROCAR IMAGEM</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setImage(null); setResult(null); }}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="text-gray-500" size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-300">Arraste ou cole seu print</p>
                  <p className="text-[10px] text-gray-500 uppercase mt-1 tracking-widest">CTRL + V habilitado</p>
                </div>
              </div>
            )}
          </div>

          <ActionButton 
            variant="outline" 
            onClick={simulateAnalysis} 
            disabled={!image} 
            loading={isAnalyzing}
          >
            <Play size={16} fill="currentColor" /> INICIAR ANÁLISE DA IA
          </ActionButton>
        </div>

        {/* RESULT SECTION */}
        <div className={`
          bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 transition-all duration-500
          ${result ? 'ring-1 ring-[#00c896]/30 shadow-[0_0_40px_rgba(0,200,150,0.05)]' : 'opacity-80'}
        `}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Resultado da IA</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00c896] rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Tempo Real</span>
            </div>
          </div>

          <div className="py-6 flex flex-col items-center justify-center min-h-[140px]">
            {result ? (
              <div className="text-center space-y-2 animate-in fade-in zoom-in duration-700">
                <div className="flex items-center justify-center gap-2 mb-1">
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{result.asset}</span>
                   <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-gray-400">{result.timeframe}</span>
                </div>
                <p className={`text-7xl font-black italic tracking-tighter drop-shadow-2xl ${result.direction === 'COMPRA' ? 'text-[#00c896]' : 'text-red-500'}`}>
                  {result.direction}
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <p className="text-3xl font-black text-white">{result.confidence}%</p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-tighter">Probabilidade</p>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-10">
                <BarChart3 size={64} className="mx-auto mb-4" />
                <p className="text-4xl font-black tracking-tighter italic">AGUARDANDO</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <ActionButton variant="secondary">
              <Save size={18} /> SALVAR
            </ActionButton>
            <ActionButton variant="secondary">
              <Share2 size={18} /> SHARE
            </ActionButton>
          </div>
        </div>

        {/* FOOTER NAV */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#111] rounded-2xl border border-white/5">
          <button className="flex flex-col items-center py-3 gap-1 text-[#00c896]">
            <BarChart3 size={20} />
            <span className="text-[10px] font-bold">DASH</span>
          </button>
          <button className="flex flex-col items-center py-3 gap-1 text-gray-600 hover:text-gray-400">
            <History size={20} />
            <span className="text-[10px] font-bold">HISTORY</span>
          </button>
          <button className="flex flex-col items-center py-3 gap-1 text-gray-600 hover:text-gray-400">
            <Settings size={20} />
            <span className="text-[10px] font-bold">CONFIG</span>
          </button>
        </div>
      </div>
    </div>
  );
}

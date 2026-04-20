import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { children } = (this as any).props;
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center animate-pulse">
            <AlertCircle size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black">عطب في المحرك الكوكبي!</h1>
            <p className="text-sm opacity-60 max-w-sm">
              حدث خطأ غير متوقع في واجهة النظام. لا تقلق، بياناتك آمنة، لكننا نحتاج لإعادة تشغيل النظام.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-white text-black font-black text-sm flex items-center gap-2 hover:scale-105 transition-all"
            >
              <RefreshCcw size={18} /> تحديث الصفحة
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 rounded-xl bg-white/10 text-white font-black text-sm flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <Home size={18} /> العودة للرئيسية
            </button>
          </div>

          <div className="mt-12 p-4 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-left max-w-lg overflow-auto max-h-32 text-rose-300">
            {this.state.error?.toString()}
          </div>
        </div>
      );
    }

    return children;
  }
}

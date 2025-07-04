import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import IAMirante from '../components/IAMirante';
import { Bot, Menu, X } from 'lucide-react';

const Layout = () => {
  const [iaMiranteOpen, setIaMiranteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar com responsividade */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header mobile com menu hambúrguer */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <img src="/logo-vip.png" alt="VIP" className="h-8 w-8" />
            <span className="font-bold text-blue-600">VIP Mudanças</span>
          </div>
          <div className="w-10"></div> {/* Spacer para centralizar logo */}
        </div>
        
        {/* Outlet para renderizar as páginas das rotas aninhadas */}
        <Outlet />
      </div>
      
      {/* Botão flutuante da IA Mirante */}
      {!iaMiranteOpen && (
        <button
          onClick={() => setIaMiranteOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group"
          title="Assistente IA Mirante"
        >
          <Bot className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}

      {/* Componente IA Mirante */}
      <IAMirante 
        isOpen={iaMiranteOpen}
        onToggle={() => setIaMiranteOpen(!iaMiranteOpen)}
        onClose={() => setIaMiranteOpen(false)}
      />
    </div>
  );
};

export default Layout;


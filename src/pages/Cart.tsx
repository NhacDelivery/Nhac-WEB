import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartProvider';
import { MdLocationOn, MdDeleteOutline, MdAdd, MdRemove, MdShoppingCart } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { items, removeItem, updateQuantity, observacao, setObservacao, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Navigate to checkout logic
    alert('Funcionalidade de checkout em breve!');
  };

  // Staggered list variant for the cart items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "tween", duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh]"
      >
        <MdShoppingCart size={80} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-500">Seu carrinho está vazio</h2>
        <button
          onClick={() => navigate('/produtos')}
          className="mt-6 bg-primary text-[color:var(--color-texto-claro)] px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm"
        >
          Ir para o Cardápio
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 lg:px-0 py-6 pb-40 overflow-hidden"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-marrom mb-6 text-center"
      >
        Carrinho
      </motion.h1>

      {/* Address Selection */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-start gap-4"
      >
        <div className="bg-primary/10 p-2.5 rounded-full">
          <MdLocationOn size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-cinza text-sm mb-1">Endereço de entrega</p>
          <p className="font-bold text-[15px] text-marrom">
            Rua Exemplo, 123 - Bairro Teste
          </p>
        </div>
        <button className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold text-black hover:bg-gray-200 transition-colors">
          Alterar
        </button>
      </motion.div>

      {/* Cart Items */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 mb-6"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div 
              key={`cart-item-${item.id}`} 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="bg-white p-4 rounded-2xl shadow-sm flex items-start gap-4"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                {item.imagemUrl ? (
                  <img src={item.imagemUrl} alt={item.nome} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🍔</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-marrom text-[15px] pr-2 line-clamp-2">
                    {item.nome}
                  </h3>
                  <div className="text-right flex-shrink-0">
                    <motion.div 
                      key={item.quantidade}
                      initial={{ scale: 1.05, color: '#FE645C' }}
                      animate={{ scale: 1, color: '#5D201C' }}
                      transition={{ duration: 0.3 }}
                      className="font-bold text-[15px]"
                    >
                      R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                    </motion.div>
                    <div className="text-cinza text-xs mt-1">{item.quantidade} un</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-300 rounded-full h-9">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                      className="w-9 h-full flex items-center justify-center text-marrom hover:bg-gray-50 rounded-l-full"
                    >
                      <MdRemove size={18} />
                    </button>
                    <span className="w-8 text-center font-bold text-[14px]">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                      className="w-9 h-full flex items-center justify-center text-marrom hover:bg-gray-50 rounded-r-full"
                    >
                      <MdAdd size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-primary hover:text-red-600 transition-colors p-2"
                  >
                    <MdDeleteOutline size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Observations */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mb-8"
      >
        <h3 className="font-bold text-marrom text-[16px] mb-3">
          Observações para o restaurante
        </h3>
        <textarea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Ex: Tirar cebola, maionese à parte, troco para R$ 50..."
          maxLength={200}
          className="w-full bg-white p-4 rounded-2xl resize-none h-28 focus:outline-none focus:ring-2 focus:ring-primary/50 text-marrom placeholder-gray-400"
        />
      </motion.div>

      {/* Floating Checkout Bar */}
      <motion.div 
        initial={{ y: 150 }}
        animate={{ y: 0 }}
        exit={{ y: 150 }}
        transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-28 lg:pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-cinza text-sm">Total a pagar</p>
            <motion.p 
              key={total}
              initial={{ scale: 1.05, color: '#FE645C' }}
              animate={{ scale: 1, color: '#5D201C' }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold"
            >
              R$ {total.toFixed(2).replace('.', ',')}
            </motion.p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-primary text-[color:var(--color-texto-claro)] px-8 py-4 rounded-full font-bold text-[16px] shadow-sm hover:opacity-90 transition-opacity"
          >
            Continuar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

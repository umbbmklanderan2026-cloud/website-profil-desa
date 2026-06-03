'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

// 1. Konfigurasi Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Konfigurasi builder baru yang modern dan bebas warning
const builder = { image: (source) => createImageUrlBuilder(client).image(source) }
function urlFor(source) {
  return builder.image(source)
}

export default function PotensiPage() {
  const [potensiData, setPotensiData] = useState([])
  const [activeTab, setActiveTab] = useState('wisata')
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  // ==================== OPSI 1: MOUSE MOVE SPOTLIGHT LIGHTS ====================
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  // ==================== OPSI 2: SCROLL-LINKED GRADIENT PROGRESS ====================
  const { scrollYProgress } = useScroll()
  
  const glowColorCenter = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['rgba(187, 251, 255, 0.45)', 'rgba(84, 9, 218, 0.25)', 'rgba(84, 9, 218, 0.45)']
  )

  const glowColorOuter = useTransform(
    scrollYProgress,
    [0, 1],
    ['rgba(84, 9, 218, 0.05)', 'rgba(187, 251, 255, 0.02)']
  )

  const dynamicBackground = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseX}px ${mouseY}px,
      ${glowColorCenter} 0%,
      ${glowColorOuter} 45%,
      rgba(255, 255, 255, 1) 85%
    )
  `

  // Deteksi Ukuran Layar HP Realtime
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mengambil data potensi dari Sanity
  useEffect(() => {
    async function fetchPotensi() {
      try {
        const data = await client.fetch(`*[_type == "potensi"]`)
        setPotensiData(data)
      } catch (error) {
        console.error("Gagal mengambil data potensi:", error)
      }
    }
    fetchPotensi()
  }, [])

  const filteredPotensi = potensiData.filter(item => item.sektor === activeTab)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#ffffff', minHeight: '100vh', color: '#222222', overflowX: 'hidden' }}>
      
      {/* ==================== 1. NAVBAR RESPONSIF GLASSMORPHIC WINDOWS ==================== */}
      <nav style={{ 
        background: 'rgba(255, 255, 255, 0.15)', 
        backdropFilter: 'blur(12px)', 
        WebkitBackdropFilter: 'blur(12px)',
        padding: isMobile ? '16px 4%' : '15px 5%', 
        position: 'absolute', 
        width: '100%',
        top: '0', 
        left: '0',
        boxSizing: 'border-box',
        zIndex: '1000', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: isMobile ? '10px' : '15px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontWeight: '900', fontSize: isMobile ? '1.1rem' : '1.3rem', color: '#ffffff', letterSpacing: '0.5px', textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>
           DESA KLANDERAN
        </div>
        <motion.a 
          href="/" 
          whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(187,251,255,0.4)' }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            textDecoration: 'none', 
            color: '#ffffff', 
            fontSize: '0.85rem', 
            fontWeight: '800', 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '8px 18px', 
            borderRadius: '20px', 
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s' 
          }}
        >
          ← Kembali ke Beranda
        </motion.a>
      </nav>

      {/* ==================== 2. BANNER UTAMA SOLID DEEP GRADIENT ==================== */}
      <div style={{ 
        background: 'linear-gradient(135deg, #110326 0%, #3e0ba3 50%, #0d021f 100%)', 
        padding: isMobile ? '120px 20px 60px 20px' : '140px 20px 80px 20px', 
        textAlign: 'center', 
        borderBottom: '3px solid #5409DA',
        boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: '#a6f7ff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '900', margin: '0 0 15px 0', textShadow: '0 2px 15px rgba(166,247,255,0.2)' }}
        >
           Sektor Potensi Desa
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ color: '#ffffff', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: '600', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6', opacity: '0.9' }}
        >
          Eksplorasi kekayaan alam lokal, komoditas unggulan sektor agraris, serta klaster wisata dan peternakan produktif di lingkungan Desa Klanderan.
        </motion.p>
      </div>

      {/* ==================== 3. AREA GRID UTAMA DENGAN REAKTIF BACKGROUND MESH ==================== */}
      <motion.div 
        onMouseMove={handleMouseMove}
        style={{ 
          background: dynamicBackground,
          width: '100%', 
          padding: '50px 0',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.1s ease-out'
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 4%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
          
          {/* BOX PANEL UTAMA: BORDER TEBAL 3PX DENGAN LAMPU NEON BERPUTAR INTERAKTIF */}
          <div 
            onMouseEnter={() => setHoveredCard('tab-panel')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ position: 'relative', borderRadius: '28px', padding: '3px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(84, 9, 218, 0.06)' }}
          >
            {/* Lampu sirkuit berjalan di sekeliling panel */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: hoveredCard === 'tab-panel' ? 3 : 12, ease: 'linear', repeat: Infinity }}
              style={{ position: 'absolute', top: '-100%', left: '-100%', width: '300%', height: '300%', background: 'conic-gradient(from 0deg, #BBFBFF 0%, #5409DA 25%, #BBFBFF 50%, #5409DA 75%, #BBFBFF 100%)', zIndex: 0 }} 
            />

            <div style={{ position: 'relative', background: 'rgba(255, 255, 255, 0.98)', padding: isMobile ? '20px 15px' : '35px', borderRadius: '25px', zIndex: 1, boxSizing: 'border-box' }}>
              
              {/* TOMBOL TAB NAVIGASI SEKTOR */}
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: '10px', 
                background: 'rgba(84, 9, 218, 0.06)', 
                padding: '8px', 
                borderRadius: '20px', 
                marginBottom: '35px',
                border: '1px solid rgba(84, 9, 218, 0.1)'
              }}>
                {['wisata', 'pertanian', 'peternakan'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '14px 0',
                      border: 'none',
                      borderRadius: '14px',
                      fontWeight: '900',
                      fontSize: '1.2rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      background: activeTab === tab ? '#5409DA' : 'transparent',
                      color: activeTab === tab ? '#ffffff' : '#5409DA',
                      boxShadow: activeTab === tab ? '0 8px 20px rgba(84, 9, 218, 0.25)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {tab === 'wisata' ? ' Wisata Desa' : tab === 'pertanian' ? ' Pertanian' : ' Peternakan'}
                  </button>
                ))}
              </div>

              {/* AREA TRANSISI ISI KONTEN POTENSI KLANDERAN */}
              <div style={{ minHeight: '350px' }}>
                <AnimatePresence mode="wait">
                  {filteredPotensi.length === 0 ? (
                    <motion.div 
                      key="empty" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      style={{ color: '#666666', fontStyle: 'italic', textAlign: 'center', padding: '80px 10px', fontWeight: '600' }}
                    >
                      Belum ada visualisasi data terunggah untuk sektor {activeTab}. Silakan tambahkan dokumen baru melalui Sanity Studio Desa Klanderan.
                    </motion.div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px' }}>
                      {filteredPotensi.map((item) => (
                        <motion.div 
                          key={item._id} 
                          initial={{ opacity: 0, scale: 0.96, y: 15 }} 
                          animate={{ opacity: 1, scale: 1, y: 0 }} 
                          exit={{ opacity: 0, scale: 0.96, y: -15 }} 
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          whileHover={{ y: -6, boxShadow: '0 12px 25px rgba(84, 9, 218, 0.08)' }}
                          style={{ 
                            background: '#ffffff', 
                            borderRadius: '20px', 
                            overflow: 'hidden', 
                            border: '2px solid rgba(187, 251, 255, 0.6)', 
                            boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {/* Bingkai Frame Foto Potensi */}
                          <div style={{ width: '100%', height: '220px', overflow: 'hidden', borderBottom: '1px solid rgba(84, 9, 218, 0.08)' }}>
                            <img 
                              src={urlFor(item.foto).url()} 
                              alt={item.namaItem} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          
                          {/* Narasi Penjelasan */}
                          <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#1a0640', fontWeight: '900', fontSize: '1.25rem', letterSpacing: '0.3px' }}>
                              {item.namaItem}
                            </h3>
                            <p style={{ margin: '0', fontSize: '0.9rem', color: '#4a4a4a', lineHeight: '1.6', textAlign: 'justify', fontWeight: '500' }}>
                              {item.penjelasan}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </motion.div>

      {/* ==================== 4. FOOTER SOLID DENGAN GRADASI TEBAL MATCHING ==================== */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #a6f7ff 0%, #3e0ba3 45%, #0d021f 100%)', 
        padding: '50px 5% 40px 5%', 
        borderTop: '4px solid #5409DA',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <h3 style={{ margin: '0', color: '#a6f7ff', fontSize: '1.2rem', fontWeight: '900', letterSpacing: '0.5px' }}>
             PEMERINTAH DESA KLANDERAN
          </h3>
          <p style={{ margin: '0', fontSize: '0.85rem', color: '#ffffff', fontWeight: '600', opacity: 0.8, maxWidth: '600px', lineHeight: '1.5' }}>
            Sistem Informasi Khazanah Wisata Alam, Komoditas Pertanian Makro, & Sektor Pembangunan Ekonomi Lokal Agro. Kec. Plosoklaten, Kabupaten Kediri, Jawa Timur.
          </p>
          <div style={{ width: '80px', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '10px 0' }} />
          <p style={{ margin: '0', fontSize: '0.78rem', color: '#ffffff', fontWeight: '750', opacity: 0.7 }}>
            {"© 2026 Tim KKN Universitas Negeri Malang. Seluruh Hak Cipta Dilindungi."}
          </p>
        </div>
      </footer>

    </div>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// 1. Konfigurasi Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
function urlFor(source) {
  return builder.image(source)
}

// Definisi Variasi Animasi untuk Kontainer Grid (Stagger Effect)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Definisi Variasi Animasi untuk Masing-masing Kartu Perangkat
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 70, 
      damping: 14 
    } 
  }
}

export default function AparaturPage() {
  const [aparatur, setAparatur] = useState([])
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

  // ==================== OPSI 2: SCROLL-LINKED GRADIENT PROGRESS (TEMA HIJAU) ====================
  const { scrollYProgress } = useScroll()
  
  const glowColorCenter = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['rgba(0, 255, 163, 0.35)', 'rgba(10, 58, 47, 0.5)', 'rgba(3, 20, 16, 0.6)']
  )

  const glowColorOuter = useTransform(
    scrollYProgress,
    [0, 1],
    ['rgba(10, 58, 47, 0.15)', 'rgba(230, 251, 247, 0.05)']
  )

  const dynamicBackground = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseX}px ${mouseY}px,
      ${glowColorCenter} 0%,
      ${glowColorOuter} 45%,
      rgba(240, 253, 244, 1) 85%
    )
  `

  // Deteksi Ukuran Layar HP secara Realtime
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mengambil data aparatur dari Sanity
  useEffect(() => {
    async function fetchAparatur() {
      try {
        const data = await client.fetch(`*[_type == "perangkat"] | order(urutan asc)`)
        setAparatur(data)
      } catch (error) {
        console.error("Gagal mengambil data aparatur:", error)
      }
    }
    fetchAparatur()
  }, [])

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
          whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,255,163,0.4)' }}
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

      {/* ==================== 2. BANNER UTAMA GLASSMORPHIC ==================== */}
      <div style={{ 
        background: 'linear-gradient(135deg, #05201A 0%, #0A3A2F 50%, #031410 100%)', 
        padding: isMobile ? '120px 20px 60px 20px' : '140px 20px 80px 20px', 
        textAlign: 'center', 
        borderBottom: '3px solid #00FFA3',
        boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: '#00FFA3', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '900', margin: '0 0 15px 0', textShadow: '0 2px 15px rgba(0,255,163,0.2)' }}
        >
          Perangkat & Pamong Desa
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ color: '#ffffff', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: '600', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6', opacity: '0.9' }}
        >
          Aparatur Pemerintah Desa Klanderan yang siap melayani kebutuhan administrasi publik dan mengawal akselerasi transformasi digital warga secara prima.
        </motion.p>
      </div>

      {/* ==================== 3. KONTEN GRID UTAMA DENGAN DUAL-INTERACTIVE BACKGROUND ==================== */}
      <motion.div 
        onMouseMove={handleMouseMove}
        style={{ 
          background: dynamicBackground,
          width: '100%', 
          padding: '60px 0',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.1s ease-out'
        }}
      >
        {/* Dekorasi lingkaran blur halus di latar belakang */}
        <div style={{ position: 'absolute', top: '10%', left: '-15%', width: '300px', height: '300px', background: 'rgba(0, 255, 163, 0.2)', filter: 'blur(90px)', borderRadius: '50%', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '-15%', width: '350px', height: '350px', background: 'rgba(10, 58, 47, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
          
          {aparatur.length === 0 ? (
            <p style={{ color: '#0A3A2F', fontStyle: 'italic', textAlign: 'center', marginTop: '40px', fontWeight: '700' }}>
              Menghubungkan ke basis data Sanity CMS...
            </p>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', 
                gap: '35px' 
              }}
            >
              {aparatur.map((p) => (
                /* BUNGKUS KARTU: TINGKAT KETEBALAN BORDER 3PX & LIGHTS BERPUTAR INTERAKTIF */
                <motion.div 
                  key={p._id}
                  variants={cardVariants}
                  onMouseEnter={() => setHoveredCard(p._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ position: 'relative', borderRadius: '28px', padding: '3px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(10, 58, 47, 0.08)' }}
                >
                  {/* Kilatan lampu gradasi sirkuit melingkar */}
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: hoveredCard === p._id ? 3 : 12, ease: 'linear', repeat: Infinity }} 
                    style={{ position: 'absolute', top: '-100%', left: '-100%', width: '300%', height: '300%', background: 'conic-gradient(from 0deg, #00FFA3, #0A3A2F, #00FFA3, #0A3A2F, #00FFA3)', zIndex: 0 }} 
                  />

                  {/* AREA ISI KONTEN KARTU KELUARGA APARATUR */}
                  <div style={{ position: 'relative', zIndex: 1, padding: '40px 20px', background: '#ffffff', borderRadius: '25px', textAlign: 'center', height: '100%', boxSizing: 'border-box' }}>
                    
                    {/* Pembungkus Foto Lingkaran Berbingkai Ganda */}
                    <div style={{ 
                      width: '130px', 
                      height: '130px', 
                      margin: '0 auto 22px auto', 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      border: '4px solid #00FFA3', 
                      boxShadow: '0 6px 16px rgba(10, 58, 47, 0.15)' 
                    }}>
                      {p.foto ? (
                        <img src={urlFor(p.foto).url()} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#e6fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A3A2F', opacity: 0.6, fontSize: '3rem' }}>👤</div>
                      )}
                    </div>

                    {/* Teks Identitas Pamong */}
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#0a241e', fontWeight: '900', lineHeight: '1.3' }}>
                      {p.nama}
                    </h3>
                    <div style={{ display: 'inline-block', background: 'rgba(10, 58, 47, 0.08)', padding: '4px 14px', borderRadius: '12px' }}>
                      <p style={{ margin: '0', fontSize: '0.8rem', color: '#0A3A2F', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        {p.jabatan}
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ==================== 4. FOOTER SOLID DENGAN GRADASI TEBAL MATCHING ==================== */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #00FFA3 0%, #0A3A2F 45%, #031410 100%)', 
        padding: '50px 5% 40px 5%', 
        borderTop: '4px solid #00FFA3',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        boxShadow: '0 -15px 40px rgba(10, 58, 47, 0.15)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <h3 style={{ margin: '0', color: '#ffffff', fontSize: '1.2rem', fontWeight: '900', letterSpacing: '0.5px', textShadow: '0 2px 10px rgba(0,255,163,0.3)' }}>
            PEMERINTAH DESA KLANDERAN
          </h3>
          <p style={{ margin: '0', fontSize: '0.85rem', color: '#ffffff', fontWeight: '600', opacity: 0.9, maxWidth: '600px', lineHeight: '1.5' }}>
            Sistem Informasi Pelayanan Struktural Pamong & Administrasi Mandiri Terpadu. Kec. Plosoklaten, Kabupaten Kediri, Jawa Timur.
          </p>
          <div style={{ width: '80px', height: '1px', background: 'rgba(255,255,255,0.3)', margin: '10px 0' }} />
          <p style={{ margin: '0', fontSize: '0.78rem', color: '#ffffff', fontWeight: '750', opacity: 0.8 }}>
            {"© 2026 Tim KKN Universitas Negeri Malang. Seluruh Hak Cipta Dilindungi."}
          </p>
        </div>
      </footer>

    </div>
  )
}
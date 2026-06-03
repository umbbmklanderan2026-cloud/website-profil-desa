'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

// 1. Konfigurasi Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Konfigurasi builder baru yang 100% bebas warning deprecated
const builder = { image: (source) => createImageUrlBuilder(client).image(source) }
function urlFor(source) {
  return builder.image(source)
}

// Varian Animasi Stagger untuk Container Grid Card
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
}

// Varian Animasi Pop-up Lembut untuk Masing-masing Event Card
const cardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 65, damping: 14 } 
  }
}

export default function EventPage() {
  const [events, setEvents] = useState([])
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

  // Mengambil data agenda event dari Sanity
  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await client.fetch(`*[_type == "event"] | order(waktuPelaksanaan asc)`)
        setEvents(data)
      } catch (error) {
        console.error("Gagal mengambil data event:", error)
      }
    }
    fetchEvents()
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
           Agenda & Kegiatan Desa
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ color: '#ffffff', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: '600', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6', opacity: '0.9' }}
        >
          Ikuti dan pantau seluruh rangkaian pengumuman resmi, kegiatan gotong royong, sosialisasi program kerja, dan festival kebudayaan mendatang di lingkungan Desa Klanderan.
        </motion.p>
      </div>

      {/* ==================== 3. GRID AREA DENGAN MOUSE TRACKING MESH GRADIENT ==================== */}
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
          
          {events.length === 0 ? (
            <p style={{ color: '#5409DA', fontStyle: 'italic', textAlign: 'center', marginTop: '40px', fontWeight: '700' }}>
              Sedang mengambil jadwal kalender event dari Sanity...
            </p>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(330px, 1fr))', 
                gap: '35px' 
              }}
            >
              {events.map((event) => (
                /* BINGKAI INTERAKTIF 3PX: PUTARAN LAMPU MEMUTAR CEPAT SAAT HOVER CARD */
                <div 
                  key={event._id}
                  onMouseEnter={() => setHoveredCard(event._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ position: 'relative', borderRadius: '28px', padding: '3px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(84, 9, 218, 0.04)' }}
                >
                  {/* Kilatan neon berjalan di sekeliling border */}
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: hoveredCard === event._id ? 3 : 12, ease: 'linear', repeat: Infinity }} 
                    style={{ position: 'absolute', top: '-100%', left: '-100%', width: '300%', height: '300%', background: 'conic-gradient(from 0deg, #BBFBFF, #5409DA, #BBFBFF, #5409DA, #BBFBFF)', zIndex: 0 }} 
                  />

                  {/* KONTEN UTAMA DI DALAM KARTU */}
                  <div style={{ position: 'relative', zIndex: 1, padding: '25px', background: '#ffffff', borderRadius: '25px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    
                    {/* Pembungkus Pamflet Banner Eksklusif */}
                    {event.pamflet && (
                      <div style={{ width: '100%', height: '210px', borderRadius: '18px', overflow: 'hidden', marginBottom: '18px', border: '1px solid rgba(84, 9, 218, 0.08)', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                        <img 
                          src={urlFor(event.pamflet).url()} 
                          alt={event.judulEvent} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                        />
                      </div>
                    )}

                    {/* Judul Event */}
                    <h3 style={{ margin: '0 0 12px 0', color: '#1a0640', fontWeight: '900', fontSize: '1.25rem', lineHeight: '1.4' }}>
                      {event.judulEvent}
                    </h3>
                    
                    {/* Detail Metatags (Lokasi & Waktu) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' }}>
                      <p style={{ fontSize: '0.92rem', color: '#5409DA', fontWeight: '800', margin: '0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📍</span> {event.lokasi}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#666666', fontWeight: '600', margin: '0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🕒</span> {new Date(event.waktuPelaksanaan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                      </p>
                    </div>

                    {/* Deskripsi Acara */}
                    {event.deskripsi && (
                      <p style={{ 
                        fontSize: '0.88rem', 
                        color: '#4a4a4a', 
                        lineHeight: '1.6', 
                        marginTop: 'auto', 
                        borderTop: '2px dashed rgba(84, 9, 218, 0.12)', 
                        paddingTop: '14px', 
                        marginBottom: '0', 
                        textAlign: 'justify',
                        fontWeight: '500'
                      }}>
                        {event.deskripsi}
                      </p>
                    )}

                  </div>
                </div>
              ))}
            </motion.div>
          )}
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
            Sistem Informasi Pelayanan Publik Publikasi Event, Maklumat Kegiatan, & Agenda Kebudayaan Tradisional Warga. Kec. Plosoklaten, Kabupaten Kediri, Jawa Timur.
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
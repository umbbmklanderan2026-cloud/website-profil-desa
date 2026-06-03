'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
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

// Varian Animasi Framer Motion untuk Hero Section
const heroContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 70, damping: 14 } 
  }
}

// PASTIKAN BARIS UTAMA INI ADA SEBAGAI DEFAULT EXPORT COMPONENT!
export default function Home() {
  const [sliders, setSliders] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  // OPSI 1: MOUSE MOVE SPOTLIGHT
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  // OPSI 2: SCROLL-LINKED GRADIENT COLOR
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

  // Deteksi Ukuran Layar HP
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mengambil data slider dari Sanity
  useEffect(() => {
    async function fetchSliders() {
      try {
        const sliderData = await client.fetch(`*[_type == "heroSlider"] | order(urutan asc)`)
        setSliders(sliderData)
      } catch (error) {
        console.error("Gagal mengambil data slider:", error)
      }
    }
    fetchSliders()
  }, [])

  // Auto-play slider setiap 5 detik
  useEffect(() => {
    if (sliders.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [sliders])

  const menuItems = [
    { name: 'Profil', link: '#profil' },
    { name: 'Struktur Organisasi', link: '/aparatur' },
    { name: 'Event', link: '/event' },
    { name: 'Potensi Desa', link: '/potensi' }, 
    { name: 'Kontak', link: '#kontak' }
  ]

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#ffffff', minHeight: '100vh', color: '#222222', overflowX: 'hidden' }}>
      
      {/* ==================== 1. NAVBAR RESPONSIF GLASSMORPHIC ==================== */}
      <motion.nav 
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 50 }}
        style={{ 
          background: isMobile ? 'rgba(255, 255, 255, 0.15)' : 'transparent', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: isMobile ? '16px 4%' : '20px 5%', 
          position: 'absolute', 
          width: '100%',
          top: '0', 
          left: '0',
          zIndex: '1000', 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: isMobile ? '10px' : '15px',
          boxSizing: 'border-box',
          borderBottom: isMobile ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
          boxShadow: isMobile ? '0 8px 32px 0 rgba(0, 0, 0, 0.15)' : 'none'
        }}
      >
        <div style={{ fontWeight: '900', fontSize: isMobile ? '1.2rem' : '1.4rem', color: '#ffffff', letterSpacing: '0.5px', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
          DESA KLANDERAN
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          background: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: isMobile ? 'none' : 'blur(5px)', 
          padding: isMobile ? '2px 0' : '6px 14px', 
          borderRadius: '30px', 
          border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.25)',
          gap: isMobile ? '6px' : '0'
        }}>
          {menuItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <motion.a 
                href={item.link} 
                whileHover={{ scale: 1.05, color: '#BBFBFF' }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  textDecoration: 'none', 
                  color: '#ffffff', 
                  fontSize: isMobile ? '0.85rem' : '0.9rem', 
                  fontWeight: '800', 
                  padding: '6px 12px', 
                  borderRadius: '20px',
                  transition: 'color 0.2s',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.4)',
                  background: isMobile ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                {item.name}
              </motion.a>
              {!isMobile && idx < menuItems.length - 1 && (
                <span style={{ width: '2px', height: '12px', background: 'rgba(255, 255, 255, 0.4)', margin: '0 4px', borderRadius: '1px' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.nav>

      {/* ==================== 2. HERO SECTION ==================== */}
      <div style={{ position: 'relative', width: '100%', height: 'auto', minHeight: '600px', overflow: 'hidden', background: '#111', paddingTop: isMobile ? '90px' : '0', display: 'flex', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {sliders.length > 0 ? (
            <motion.img
              key={currentSlide}
              src={urlFor(sliders[currentSlide].gambar).url()}
              alt="Keindahan Village"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 0.75, scale: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #BBFBFF, #5409DA)', zIndex: 1 }} />
          )}
        </AnimatePresence>

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(255,255,255,0) 70%, #ffffff 100%)', zIndex: 2 }} />

        <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '20px', boxSizing: 'border-box' }}>
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="show"
            style={{ 
              background: 'rgba(255, 255, 255, 0.12)', 
              backdropFilter: 'blur(8px)', 
              WebkitBackdropFilter: 'blur(8px)',
              padding: isMobile ? '30px 20px' : '40px 5%', 
              borderRadius: '24px', 
              border: '2px solid rgba(255, 255, 255, 0.35)', 
              maxWidth: '850px', 
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box',
              boxShadow: '0 15px 45px rgba(0, 0, 0, 0.2)'
            }}
          >
            <motion.span variants={heroItemVariants} style={{ fontSize: isMobile ? '0.8rem' : '1.05rem', color: '#ffffff', fontWeight: '850', textTransform: 'uppercase', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
              Selamat Datang Di Portal Resmi
            </motion.span>
            
            <motion.h1 variants={heroItemVariants} style={{ fontSize: 'clamp(1.5rem, 4.5vw, 3.4rem)', fontWeight: '900', margin: '12px 0', lineHeight: '1.2', color: '#ffffff', textShadow: '2px 2px 12px rgba(84, 9, 218, 0.85)' }}>
              PEMERINTAH DESA KLANDERAN
            </motion.h1>
            
            <motion.p variants={heroItemVariants} style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1.15rem)', color: '#ffffff', margin: '0 0 25px 0', lineHeight: '1.6', fontWeight: '700', textShadow: '1px 1px 6px rgba(0,0,0,0.6)' }}>
              Kecamatan Plosoklaten, Kabupaten Kediri, Jawa Timur.
              <br />
             
            </motion.p>
            
            <motion.div variants={heroItemVariants} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.a 
                href="#menu-pintu-halaman" 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: '#5409DA', color: '#ffffff', textDecoration: 'none', padding: isMobile ? '10px 20px' : '13px 28px', borderRadius: '30px', fontSize: isMobile ? '0.85rem' : '0.95rem', fontWeight: '800' }}
              >
                Eksplorasi Layanan
              </motion.a>
              <motion.a 
                href="#profil" 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', textDecoration: 'none', padding: isMobile ? '10px 20px' : '13px 28px', borderRadius: '30px', fontSize: isMobile ? '0.85rem' : '0.95rem', fontWeight: '800', border: '2px solid #ffffff', backdropFilter: 'blur(4px)' }}
              >
                Profil Desa
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ==================== 3. KONTEN UTAMA DENGAN REAKTIF SPOTLIGHT BACKGROUND ==================== */}
      <motion.div 
        onMouseMove={handleMouseMove} 
        style={{ 
          background: dynamicBackground, 
          width: '100%', 
          padding: isMobile ? '40px 0' : '60px 0',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.1s ease-out'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 4%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>

          {/* BOX PROFIL BESAR: BORDER 3PX & FAST INTERACTIVE LIGHTS SAAT HOVER */}
          <div 
            onMouseEnter={() => setHoveredCard('profil')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ position: 'relative', borderRadius: '24px', padding: '3px', overflow: 'hidden', marginBottom: '50px', boxShadow: '0 20px 45px rgba(84, 9, 218, 0.08)' }}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: hoveredCard === 'profil' ? 3 : 9, ease: 'linear', repeat: Infinity }}
              style={{ 
                position: 'absolute', 
                top: '-100%', 
                left: '-100%', 
                width: '300%', 
                height: '300%', 
                background: 'conic-gradient(from 0deg, #BBFBFF 0%, #5409DA 25%, #BBFBFF 50%, #5409DA 75%, #BBFBFF 100%)', 
                zIndex: 0 
              }} 
            />

            <motion.section 
              id="profil" 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ 
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.97)', 
                padding: isMobile ? '25px 15px' : '45px 40px', 
                borderRadius: '21px', 
                zIndex: 1,
                boxSizing: 'border-box'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span style={{ background: 'rgba(84, 9, 218, 0.08)', color: '#5409DA', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Selayang Pandang
                </span>
                <h2 style={{ color: '#1a0640', fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: '900', margin: '10px 0 0 0' }}>
                  Profil & Visi Misi Desa
                </h2>
              </div>
              
              <p style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', lineHeight: '1.7', color: '#4a4a4a', textAlign: 'justify', maxWidth: '900px', margin: '0 auto 35px auto', fontWeight: '500' }}>
                Desa Klanderan merupakan salah satu kawasan agraris potensial yang terletak di wilayah Kecamatan Plosoklaten, Kabupaten Kediri. Memiliki komoditas tanah yang subur serta kerukunan masyarakat yang kental, portal profil desa digital ini menjadi wajah keterbukaan informasi publik dan pelayanan mandiri warga.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9f6ff 100%)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(84, 9, 218, 0.12)' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', color: '#5409DA', fontWeight: '900' }}> Visi Utama</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic', color: '#333333', margin: '0', fontWeight: '600' }}>
                    "Mewujudkan tata kelola Pemerintahan Desa Klanderan yang bersih, transparan, akuntabel, dan bermartabat guna mencapai masyarakat yang maju, sejahtera, religius, serta unggul di bidang agraris."
                  </p>
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f4fdfb 100%)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(27, 203, 169, 0.12)', borderLeft: '5px solid #5409DA' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', color: '#111', fontWeight: '900' }}> Misi Strategis</h3>
                  <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '0.9rem', lineHeight: '1.6', color: '#444444', fontWeight: '500' }}>
                    <li style={{ marginBottom: '6px' }}>Meningkatkan kualitas SDM aparatur dalam percepatan reformasi birokrasi digital.</li>
                    <li style={{ marginBottom: '6px' }}>Mendorong efisiensi transparansi dana desa secara terbuka melalui sistem informasi.</li>
                    <li>Meningkatkan kualitas infrastruktur pertanian desa Klanderan secara terpadu.</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </div>

          {/* SEKAT DIVIDER GLOW NEON DI PERTEBAL 6PX */}
          <div style={{ position: 'relative', margin: '50px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div 
              animate={{ opacity: [0.4, 0.9, 0.4], scaleY: [1, 1.6, 1] }}
              transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
              style={{ position: 'absolute', width: '100%', height: '6px', background: 'linear-gradient(to right, transparent 0%, #BBFBFF 25%, #5409DA 50%, #BBFBFF 75%, transparent 100%)', filter: 'blur(5px)' }} 
            />
            <div style={{ position: 'relative', width: '100%', height: '3px', background: 'linear-gradient(to right, transparent 0%, rgba(187, 251, 255, 0.9) 20%, #5409DA 50%, rgba(187, 251, 255, 0.9) 80%, transparent 100%)' }} />
          </div>

          {/* 4. PUSAT LAYANAN: CARD BORDER TEBAL 3PX */}
          <section id="menu-pintu-halaman" style={{ marginTop: '10px', marginBottom: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <span style={{ background: '#5409DA', color: '#ffffff', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px' }}>
                MENU UTAMA
              </span>
              <h2 style={{ color: '#1a0640', fontSize: '1.5rem', fontWeight: '900', margin: '8px 0 6px 0' }}>
                Pusat Layanan & Informasi Desa
              </h2>
              <p style={{ color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>Silakan pilih menu interaktif di bawah untuk menelusuri data desa secara spesifik:</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
              
              {/* CARD 1: APARATUR */}
              <div 
                onMouseEnter={() => setHoveredCard('c1')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ position: 'relative', borderRadius: '24px', padding: '3px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(84, 9, 218, 0.05)' }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: hoveredCard === 'c1' ? 3 : 12, ease: 'linear', repeat: Infinity }} style={{ position: 'absolute', top: '-100%', left: '-100%', width: '300%', height: '300%', background: 'conic-gradient(from 0deg, #BBFBFF, #5409DA, #BBFBFF, #5409DA, #BBFBFF)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '30px 22px', background: '#ffffff', borderRadius: '21px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
                  <div>
                    <div style={{ width: '50px', height: '50px', background: '#f0e6ff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.6rem', marginBottom: '15px' }}>👥</div>
                    <h3 style={{ color: '#1a0640', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Perangkat Desa</h3>
                    <p style={{ color: '#666666', fontSize: '0.85rem', margin: '0 0 20px 0', lineHeight: '1.5', fontWeight: '500' }}>Kenali lebih dekat jajaran struktural pamong, Kepala Desa, dan staff pelayanan Desa Klanderan.</p>
                  </div>
                  <a href="/aparatur" style={{ display: 'block', textAlign: 'center', background: '#5409DA', color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderRadius: '12px', fontWeight: '800', fontSize: '0.85rem' }}>Buka Struktur →</a>
                </div>
              </div>

              {/* CARD 2: EVENT */}
              <div 
                onMouseEnter={() => setHoveredCard('c2')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ position: 'relative', borderRadius: '24px', padding: '3px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(84, 9, 218, 0.05)' }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: hoveredCard === 'c2' ? 3 : 12, ease: 'linear', repeat: Infinity }} style={{ position: 'absolute', top: '-100%', left: '-100%', width: '300%', height: '300%', background: 'conic-gradient(from 0deg, #BBFBFF, #5409DA, #BBFBFF, #5409DA, #BBFBFF)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '30px 22px', background: '#ffffff', borderRadius: '21px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
                  <div>
                    <div style={{ width: '50px', height: '50px', background: '#e6faff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.6rem', marginBottom: '15px' }}>📅</div>
                    <h3 style={{ color: '#1a0640', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Agenda & Event</h3>
                    <p style={{ color: '#666666', fontSize: '0.85rem', margin: '0 0 20px 0', lineHeight: '1.5', fontWeight: '500' }}>Kalender kegiatan terintegrasi, info sosialisasi program kerja, dan musyawarah mufakat warga desa.</p>
                  </div>
                  <a href="/event" style={{ display: 'block', textAlign: 'center', background: '#5409DA', color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderRadius: '12px', fontWeight: '800', fontSize: '0.85rem' }}>Buka Agenda →</a>
                </div>
              </div>

              {/* CARD 3: POTENSI DESA */}
              <div 
                onMouseEnter={() => setHoveredCard('c3')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ position: 'relative', borderRadius: '24px', padding: '3px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(84, 9, 218, 0.05)' }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: hoveredCard === 'c3' ? 3 : 12, ease: 'linear', repeat: Infinity }} style={{ position: 'absolute', top: '-100%', left: '-100%', width: '300%', height: '300%', background: 'conic-gradient(from 0deg, #BBFBFF, #5409DA, #BBFBFF, #5409DA, #BBFBFF)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '30px 22px', background: '#ffffff', borderRadius: '21px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
                  <div>
                    <div style={{ width: '50px', height: '50px', background: '#eafaf1', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.6rem', marginBottom: '15px' }}>🌾</div>
                    <h3 style={{ color: '#1a0640', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Potensi Desa</h3>
                    <p style={{ color: '#666666', fontSize: '0.85rem', margin: '0 0 20px 0', lineHeight: '1.5', fontWeight: '500' }}>Eksplorasi mendalam sub-sektor unggulan desa: Wisata Alam, Pertanian Makro, dan Peternakan Modern.</p>
                  </div>
                  <a href="/potensi" style={{ display: 'block', textAlign: 'center', background: '#5409DA', color: '#ffffff', textDecoration: 'none', padding: '10px 0', borderRadius: '12px', fontWeight: '800', fontSize: '0.85rem' }}>Buka Potensi →</a>
                </div>
              </div>

              {/* CARD 4: LAYANAN */}
            {/* CARD 4: LAYANAN - SEKARANG LANGSUNG TERHUBUNG KE INSTAGRAM */}
            <div 
                onMouseEnter={() => setHoveredCard('c4')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ position: 'relative', borderRadius: '24px', padding: '3px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(27, 203, 169, 0.05)' }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: hoveredCard === 'c4' ? 3 : 12, ease: 'linear', repeat: Infinity }} style={{ position: 'absolute', top: '-100%', left: '-100%', width: '300%', height: '300%', background: 'conic-gradient(from 0deg, #BBFBFF, #5409DA, #BBFBFF, #5409DA, #BBFBFF)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '30px 22px', background: '#ffffff', borderRadius: '21px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
                  <div>
                    <div style={{ width: '50px', height: '50px', background: '#e6fbe7', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.6rem', marginBottom: '15px' }}>📁</div>
                    <h3 style={{ color: '#1a0640', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Layanan Publik</h3>
                    <p style={{ color: '#666666', fontSize: '0.85rem', margin: '0 0 20px 0', lineHeight: '1.5', fontWeight: '500' }}>Panduan administratif pengurusan surat pengantar kependudukan, KK, KTP, dan blanko mandiri digital.</p>
                  </div>
                  
                  {/* PERBAIKAN: Mengubah <button> lama menjadi <motion.a> yang langsung mengarah ke Instagram */}
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://www.instagram.com/um.bbmklanderan?igsh=Z2VmZGNnbmozd3px" // Sesuai dengan akun Instagram yang Anda gunakan
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'block', 
                      textAlign: 'center',
                      width: '100%', 
                      textDecoration: 'none',
                      background: '#1bcba9', 
                      color: '#ffffff', 
                      padding: '11px 0', 
                      borderRadius: '12px', 
                      fontWeight: '800', 
                      fontSize: '0.85rem', 
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    Ajukan Surat →
                  </motion.a>
                </div>
              </div>

            </div>
          </section>

        </div>
      </motion.div>

      {/* ==================== 5. PERBAIKAN: FOOTER DENGAN WARNA GRADASI ICE BLUE UNGU YANG TEBAL DAN JELAS ==================== */}
      <footer 
        id="kontak" 
        style={{ 
          background: 'linear-gradient(135deg, #a6f7ff 0%, #3e0ba3 45%, #0d021f 100%)', 
          padding: isMobile ? '50px 6% 30px 6%' : '70px 5% 30px 5%', 
          borderTop: '4px solid #5409DA', 
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 -15px 40px rgba(84, 9, 218, 0.15)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', textAlign: 'left' }}>
          
          {/* IDENTITAS DESA & SOSIAL MEDIA INTERAKTIF */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', color: '#1a0640', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '0.5px', textShadow: '0 2px 10px rgba(166,247,255,0.2)' }}>
               DESA KLANDERAN
            </h3>
            <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 25px 0', fontWeight: '600', opacity: '0.95' }}>
              Pusat pelayanan administrasi publik dan keterbukaan informasi digital terintegrasi untuk mewujudkan Klanderan yang mandiri dan unggul.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { name: '🎵 TikTok', url: 'https://www.tiktok.com/@um.bbmklanderan2026?_r=1&_t=ZS-96uANw5v442' },
                { name: '📸 Instagram', url: 'https://www.instagram.com/um.bbmklanderan?igsh=Z2VmZGNnbmozd3px' }, 
                { name: '📞 WA', url: 'https://wa.me/082131890757' }, 
                { name: '✉️ Email', url: 'mailto:umbbmklanderan2026@gmail.com' }
              ].map((soc, i) => (
                <motion.a 
                  key={i} 
                  whileHover={{ scale: 1.1, background: '#ffffff', color: '#3e0ba3', boxShadow: '0 8px 20px rgba(166,247,255,0.4)', borderColor: '#ffffff' }}
                  whileTap={{ scale: 0.95 }}
                  href={soc.url}
                  target={soc.url.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', textDecoration: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', border: '2px solid rgba(255,255,255,0.3)', transition: 'background 0.2s, color 0.2s, border-color 0.2s' }}
                >
                  {/* PERBAIKAN: Tulis {soc.name}, jangan cuma {soc} */}
                  {soc.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* KONTAK RESMI */}
          <div>
            <h4 style={{ margin: '0 0 15px 0', color: '#a6f7ff', fontSize: '1.4rem', fontWeight: '800', borderLeft: '4px solid #ffffff', paddingLeft: '10px' }}> Kontak Resmi</h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#ffffff', fontWeight: '600' }}>🏢 Balai Desa Klanderan, Kec. Plosoklaten, Kediri.</p>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#ffffff', fontWeight: '600' }}>📞 +62 812-1234-5678</p>
            <p style={{ margin: '0', fontSize: '0.88rem', color: '#ffffff', fontWeight: '600' }}>✉️ umbbmklanderan2026@gmail.com</p>
          </div>

          {/* PETA LOKASI DIGITAL GOOGLE MAPS */}
          <div>
            <h4 style={{ margin: '0 0 15px 0', color: '#a6f7ff', fontSize: '1.4rem', fontWeight: '800', borderLeft: '4px solid #ffffff', paddingLeft: '10px' }}> Lokasi Kantor Desa</h4>
            <div style={{ width: '100%', height: '140px', borderRadius: '16px', overflow: 'hidden', border: '3px solid #3e0ba3', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.940244793547!2d112.126776!3d-7.8361744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7858dac89e799d%3A0x62a0e8bb8a5d6fa0!2sBalai%20Desa%20Klanderan!5e0!3m2!1sid!2sid!4v1717424000000!5m2!1sid!2sid" 
                style={{ border: 0, width: '100%', height: '100%' }} 
                allowFullScreen="" 
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '30px auto 20px auto', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)' }} />
        
        <p style={{ margin: '0', fontSize: '0.78rem', color: '#ffffff', textAlign: 'center', fontWeight: '750', opacity: '0.8' }}>
          {"© 2026 Tim KKN Universitas Negeri Malang. Seluruh Hak Cipta Dilindungi."}
        </p>
      </footer>

    </div>
  )
}
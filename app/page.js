'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

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

export default function Home() {
  const [sliders, setSliders] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

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

  useEffect(() => {
    if (sliders.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [sliders])

  // Menu navigasi terarah ke halaman folder terpisah masing-masing
  const menuItems = [
    { name: 'Profil Desa', link: '#profil' },
    { name: 'Aparatur', link: '/aparatur' },
    { name: 'Agenda Event', link: '/eventt' },
    { name: 'Potensi Desa', link: '/potensi' }, 
    { name: 'Kontak Layanan', link: '#kontak' }
  ]

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#ffffff', minHeight: '100vh', color: '#222222', overflowX: 'hidden' }}>
      
      {/* 1. NAVBAR GLASSMORPHIC SEMI-TRANSPARAN ICE BLUE */}
      <nav style={{ 
        background: 'rgba(187, 251, 255, 0.75)', 
        backdropFilter: 'blur(12px)', 
        WebkitBackdropFilter: 'blur(12px)',
        padding: '15px 5%', 
        position: 'sticky', 
        top: '0', 
        zIndex: '1000', 
        boxShadow: '0 4px 20px rgba(84, 9, 218, 0.05)', 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '15px',
        borderBottom: '2px solid rgba(84, 9, 218, 0.4)'
      }}>
        <div style={{ fontWeight: '900', fontSize: '1.3rem', color: '#5409DA', letterSpacing: '0.5px' }}>
          🏡 DESA KLANDERAN
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.4)', padding: '4px 10px', borderRadius: '30px', border: '1px solid rgba(84, 9, 218, 0.15)' }}>
          {menuItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <a href={item.link} style={{ textDecoration: 'none', color: '#5409DA', fontSize: '0.9rem', fontWeight: '800', padding: '6px 14px', borderRadius: '20px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.background = '#ffffff'; e.target.style.boxShadow = '0 2px 8px rgba(84, 9, 218, 0.1)' }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none' }}>
                {item.name}
              </a>
              {idx < menuItems.length - 1 && (
                <span style={{ width: '2px', height: '14px', background: 'rgba(84, 9, 218, 0.4)', margin: '0 4px', borderRadius: '1px' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <div style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden', background: '#111', marginTop: '-70px', paddingTop: '70px' }}>
        <AnimatePresence mode="wait">
          {sliders.length > 0 && (
            <motion.img key={currentSlide} src={urlFor(sliders[currentSlide].gambar).url()} alt="Keindahan Desa" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
          )}
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0) 60%, #ffffff 100%)', zIndex: 2 }} />
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '0 20px' }}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', padding: '35px 5%', borderRadius: '24px', border: '2px solid rgba(255, 255, 255, 0.5)', maxWidth: '850px', width: '100%', textAlign: 'center', boxSizing: 'border-box', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)' }}>
            <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#ffffff', fontWeight: '900', letterSpacing: '2.5px', textTransform: 'uppercase', textShadow: '1px 1px 5px rgba(0,0,0,0.6)' }}>Selamat Datang Di Portal Resmi</span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', fontWeight: '900', margin: '10px 0', lineHeight: '1.2', color: '#ffffff', textShadow: '2px 2px 10px rgba(84, 9, 218, 0.8)' }}>PEMERINTAH DESA KLANDERAN</h1>
            <p style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)', color: '#ffffff', margin: '0 0 25px 0', lineHeight: '1.5', fontWeight: '700', textShadow: '1px 1px 6px rgba(0,0,0,0.7)' }}>📍 Kecamatan Plosoklaten, Kabupaten Kediri, Jawa Timur.</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#menu-pintu-halaman" style={{ background: '#5409DA', color: '#ffffff', textDecoration: 'none', padding: '12px 26px', borderRadius: '30px', fontSize: '0.95rem', fontWeight: '800', boxShadow: '0 4px 15px rgba(84, 9, 218, 0.4)' }}>🚀 Eksplorasi Layanan</a>
              <a href="#profil" style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff', textDecoration: 'none', padding: '12px 26px', borderRadius: '30px', fontSize: '0.95rem', fontWeight: '800', border: '2px solid #ffffff', backdropFilter: 'blur(4px)' }}>Profil Desa</a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* DASHBOARD KONTEN UTAMA PROFIL DESA */}
      <div style={{ background: '#ffffff', width: '100%', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 5%', boxSizing: 'border-box' }}>

          {/* SECTION PROFIL & STRUKTUR SEJARAH */}
          <section id="profil" style={{ marginBottom: '60px', background: '#ffffff', padding: 'clamp(25px, 4vw, 40px)', borderRadius: '24px', boxShadow: '0 8px 30px rgba(84,9,218,0.03)', border: '2px solid #BBFBFF' }}>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <h2 style={{ color: '#5409DA', fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: '800', margin: '0 0 8px 0' }}>📖 Profil & Visi Misi Desa Klanderan</h2>
              <div style={{ width: '50px', height: '4px', background: '#5409DA', margin: '0 auto', borderRadius: '2px' }} />
            </div>
            
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#333', textAlign: 'justify', marginBottom: '30px' }}>
              Desa Klanderan merupakan salah satu kawasan agraris potensial yang terletak di wilayah Kecamatan Plosoklaten, Kabupaten Kediri. Memiliki komoditas tanah yang subur serta kerukunan masyarakat yang kental, portal profil desa digital ini menjadi wajah keterbukaan informasi publik dan pelayanan mandiri warga.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '25px' }}>
              <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', color: '#222222', border: '2px solid #BBFBFF' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#5409DA', fontWeight: '800' }}>✨ Visi Utama</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.65', fontStyle: 'italic', color: '#444444', margin: '0' }}>
                  "Mewujudkan tata kelola Pemerintahan Desa Klanderan yang bersih, transparan, akuntabel, dan bermartabat guna mencapai masyarakat yang maju, sejahtera, religius, serta unggul di bidang agraris."
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', borderLeft: '6px solid #5409DA', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', borderRight: '1px solid #eee' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#5409DA', fontWeight: '800' }}>🎯 Misi Pemerintahan</h3>
                <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '0.95rem', lineHeight: '1.7', color: '#444444' }}>
                  <li>Meningkatkan kualitas SDM aparatur dalam percepatan reformasi birokrasi digital.</li>
                  <li>Mendorong efisiensi transparansi dana desa secara terbuka melalui sistem informasi.</li>
                  <li>Meningkatkan kualitas infrastruktur pertanian desa Klanderan.</li>
                </ul>
              </div>
            </div>
          </section>

          <hr style={{ border: 'none', height: '2px', background: 'linear-gradient(to right, transparent, rgba(84, 9, 218, 0.4), transparent)', margin: '50px 0' }} />

          {/* SECTION HUB / PINTU AKSES MASUK MENU UTAMA HALAMAN TERPISAH */}
          <section id="menu-pintu-halaman" style={{ marginBottom: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <h2 style={{ color: '#5409DA', fontSize: '1.6rem', fontWeight: '800', margin: '0' }}>⚡ Layanan & Eksplorasi Informasi Desa</h2>
              <p style={{ color: '#666', fontSize: '0.95rem', margin: '5px 0 0 0' }}>Klik salah satu kartu di bawah untuk membuka halaman informasi terisolasi:</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
              
              {/* PINTU 1: APARATUR */}
              <motion.div whileHover={{ y: -4 }} style={{ padding: '30px 20px', background: '#ffffff', borderRadius: '20px', border: '2.5px solid #5409DA', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div><div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div><h3 style={{ color: '#5409DA', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Perangkat Desa</h3><p style={{ color: '#444444', fontSize: '0.85rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>Kenali lebih dekat jajaran struktural pamong, Kepala Desa, dan staff pelayanan Desa Klanderan.</p></div>
                <a href="/aparatur" style={{ display: 'block', background: '#BBFBFF', color: '#5409DA', textDecoration: 'none', padding: '8px 0', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', border: '1px solid #5409DA' }}>Buka Struktur →</a>
              </motion.div>

              {/* PINTU 2: EVENT */}
              <motion.div whileHover={{ y: -4 }} style={{ padding: '30px 20px', background: '#ffffff', borderRadius: '20px', border: '2.5px solid #5409DA', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div><div style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div><h3 style={{ color: '#5409DA', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Agenda & Event</h3><p style={{ color: '#444444', fontSize: '0.85rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>Kalender kegiatan, sosialisasi program KKN UM 2026, dan musyawarah mufakat warga desa.</p></div>
                <a href="/event" style={{ display: 'block', background: '#BBFBFF', color: '#5409DA', textDecoration: 'none', padding: '8px 0', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', border: '1px solid #5409DA' }}>Buka Agenda →</a>
              </motion.div>

              {/* PINTU 3: POTENSI DESA */}
              <motion.div whileHover={{ y: -4 }} style={{ padding: '30px 20px', background: '#ffffff', borderRadius: '20px', border: '2.5px solid #5409DA', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div><div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌾</div><h3 style={{ color: '#5409DA', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Potensi 3 Sektor</h3><p style={{ color: '#444444', fontSize: '0.85rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>Eksplorasi mendalam interaktif komoditas Wisata alam, Pertanian makro, dan Peternakan terpadu.</p></div>
                <a href="/potensi" style={{ display: 'block', background: '#BBFBFF', color: '#5409DA', textDecoration: 'none', padding: '8px 0', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', border: '1px solid #5409DA' }}>Buka Sektor Potensi →</a>
              </motion.div>

              {/* PINTU 4: LAYANAN */}
              <motion.div whileHover={{ y: -4 }} style={{ padding: '30px 20px', background: '#ffffff', borderRadius: '20px', border: '2.5px solid #5409DA', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div><div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div><h3 style={{ color: '#5409DA', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Layanan Publik</h3><p style={{ color: '#444444', fontSize: '0.85rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>Syarat pengurusan dokumen kependudukan, surat pengantar RT/RW, dan blanko mandiri administrasi.</p></div>
                <button onClick={() => alert('Loket pengajuan administrasi surat digital sedang disiapkan oleh admin desa.')} style={{ display: 'block', width: '100%', background: '#BBFBFF', color: '#5409DA', border: '1px solid #5409DA', padding: '8px 0', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}>Buka Layanan →</button>
              </motion.div>

            </div>
          </section>

        </div>
      </div>

      {/* FOOTER */}
      <footer id="kontak" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #f6f8fc 100%)', color: '#444444', padding: '50px 5%', textAlign: 'center', borderTop: '1px solid #eee' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#5409DA', fontSize: '1.3rem', fontWeight: '900' }}>Pemerintah Desa Klanderan Resmi</h3>
        <p style={{ margin: '4px 0', opacity: '0.9', fontSize: '0.95rem', fontWeight: '600' }}>Kantor Balai Desa Klanderan, Kec. Plosoklaten, Kabupaten Kediri, Jawa Timur</p>
        <p style={{ margin: '4px 0', color: '#5409DA', fontSize: '0.85rem', fontWeight: '700' }}>📧 kontak@desaklanderan.id | 📞 WhatsApp Layanan: 0812-XXXX-XXXX</p>
        <div style={{ margin: '25px auto 0 auto', width: '60px', height: '2px', background: 'rgba(84, 9, 218, 0.2)' }} />
        <p style={{ margin: '15px 0 0 0', fontSize: '0.8rem', color: '#888888', fontWeight: '600' }}>&copy; 2026 Tim KKN Universitas Negeri Malang. All Rights Reserved.</p>
      </footer>

    </div>
  )
}
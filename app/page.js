'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)
function urlFor(source) {
  return builder.image(source)
}

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

  const menuItems = [
    { name: 'Profil Desa', link: '#profil' },
    { name: 'Aparatur', link: '/aparatur' },
    { name: 'Agenda Event', link: '/event' },
    { name: 'Potensi Desa', link: '/potensi' }, 
    { name: 'Kontak Layanan', link: '#kontak' }
  ]

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#ffffff', minHeight: '100vh', color: '#222222', overflowX: 'hidden' }}>
      
      {/* 1. NAVBAR TRANSPARAN MURNI */}
      <motion.nav 
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 50 }}
        style={{ 
          background: 'transparent', 
          padding: '20px 5%', 
          position: 'absolute', 
          width: '100%',
          top: '0', 
          left: '0',
          zIndex: '1000', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '15px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#ffffff', letterSpacing: '0.5px', textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>
          🏡 DESA KLANDERAN
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
          {menuItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <motion.a 
                href={item.link} 
                whileHover={{ scale: 1.05, color: '#BBFBFF' }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  textDecoration: 'none', 
                  color: '#ffffff', 
                  fontSize: '0.9rem', 
                  fontWeight: '800', 
                  padding: '6px 12px', 
                  borderRadius: '20px',
                  transition: 'color 0.2s',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
                }}
              >
                {item.name}
              </motion.a>
              {idx < menuItems.length - 1 && (
                <span style={{ width: '2px', height: '12px', background: 'rgba(255, 255, 255, 0.4)', margin: '0 4px', borderRadius: '1px' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.nav>

      {/* 2. HERO SECTION */}
      <div style={{ position: 'relative', width: '100%', height: '85vh', overflow: 'hidden', background: '#111' }}>
        <AnimatePresence mode="wait">
          {sliders.length > 0 ? (
            <motion.img
              key={currentSlide}
              src={urlFor(sliders[currentSlide].gambar).url()}
              alt="Keindahan Desa Klanderan"
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

        <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="show"
            style={{ 
              background: 'rgba(255, 255, 255, 0.15)', 
              backdropFilter: 'blur(4px)', 
              WebkitBackdropFilter: 'blur(4px)',
              padding: '40px 5%', 
              borderRadius: '28px', 
              border: '2.5px solid rgba(255, 255, 255, 0.45)', 
              maxWidth: '850px', 
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box',
              boxShadow: '0 15px 45px rgba(0, 0, 0, 0.25)'
            }}
          >
            <motion.span variants={heroItemVariants} style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#BBFBFF', fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>
              Selamat Datang Di Portal Resmi
            </motion.span>
            
            <motion.h1 variants={heroItemVariants} style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.4rem)', fontWeight: '900', margin: '12px 0', lineHeight: '1.2', color: '#ffffff', textShadow: '2px 2px 12px rgba(84, 9, 218, 0.85)' }}>
              PEMERINTAH DESA KLANDERAN
            </motion.h1>
            
            {/* PERBAIKAN SINTAKS: Memisahkan baris teks menggunakan struktur paragraf tunggal JSX yang aman */}
            <motion.p variants={heroItemVariants} style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1.15rem)', color: '#ffffff', margin: '0 0 30px 0', lineHeight: '1.6', fontWeight: '700', textShadow: '1px 1px 6px rgba(0,0,0,0.6)' }}>
              Kecamatan Plosoklaten, Kabupaten Kediri, Jawa Timur.
              <br />
              Pusat Informasi Publik, Transparansi Pemerintahan, & Layanan Masyarakat Digital Terpadu.
            </motion.p>
            
            <motion.div variants={heroItemVariants} style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.a 
                href="#menu-pintu-halaman" 
                whileHover={{ scale: 1.08, y: -2, boxShadow: '0 6px 20px rgba(84, 9, 218, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                style={{ background: '#5409DA', color: '#ffffff', textDecoration: 'none', padding: '13px 28px', borderRadius: '30px', fontSize: '0.95rem', fontWeight: '800', transition: 'box-shadow 0.2s' }}
              >
                🚀 Eksplorasi Layanan
              </motion.a>
              <motion.a 
                href="#profil" 
                whileHover={{ scale: 1.08, y: -2, background: 'rgba(255,255,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', textDecoration: 'none', padding: '13px 28px', borderRadius: '30px', fontSize: '0.95rem', fontWeight: '800', border: '2px solid #ffffff', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
              >
                Profil Desa
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* DASHBOARD KONTEN UTAMA PROFIL DESA */}
      <div style={{ background: '#ffffff', width: '100%', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 5%', boxSizing: 'border-box' }}>

          {/* 3. SEKSI PROFIL & VISI MISI */}
          <motion.section 
            id="profil" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 50 }}
            style={{ marginBottom: '60px', background: '#ffffff', padding: 'clamp(25px, 4vw, 40px)', borderRadius: '24px', boxShadow: '0 10px 35px rgba(84,9,218,0.04)', border: '2px solid #BBFBFF' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <h2 style={{ color: '#5409DA', fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: '800', margin: '0 0 8px 0' }}>📖 Profil & Visi Misi Desa Klanderan</h2>
              <div style={{ width: '50px', height: '4px', background: '#5409DA', margin: '0 auto', borderRadius: '2px' }} />
            </div>
            
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#333', textAlign: 'justify', marginBottom: '30px', fontWeight: '500' }}>
              Desa Klanderan merupakan salah satu kawasan agraris potensial yang terletak di wilayah Kecamatan Plosoklaten, Kabupaten Kediri. Memiliki komoditas tanah yang subur serta kerukunan masyarakat yang kental, portal profil desa digital ini menjadi wajah keterbukaan informasi publik dan pelayanan mandiri warga.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '25px' }}>
              <motion.div whileHover={{ y: -4, borderColor: '#5409DA' }} style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', color: '#222222', border: '2px solid #BBFBFF', transition: 'border-color 0.2s' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#5409DA', fontWeight: '800' }}>✨ Visi Utama</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.65', fontStyle: 'italic', color: '#444444', margin: '0' }}>
                  "Mewujudkan tata kelola Pemerintahan Desa Klanderan yang bersih, transparan, akuntabel, dan bermartabat guna mencapai masyarakat yang maju, sejahtera, religius, serta unggul di bidang agraris."
                </p>
              </motion.div>
              
              <motion.div whileHover={{ y: -4 }} style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', borderLeft: '6px solid #5409DA', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', borderRight: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#5409DA', fontWeight: '800' }}>🎯 Misi Pemerintahan</h3>
                <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '0.95rem', lineHeight: '1.7', color: '#444444' }}>
                  <li>Meningkatkan kualitas SDM aparatur dalam percepatan reformasi birokrasi digital.</li>
                  <li>Mendorong efisiensi transparansi dana desa secara terbuka melalui sistem informasi.</li>
                  <li>Meningkatkan kualitas infrastruktur pertanian desa Klanderan.</li>
                </ul>
              </motion.div>
            </div>
          </motion.section>

          <hr style={{ border: 'none', height: '2px', background: 'linear-gradient(to right, transparent, rgba(84, 9, 218, 0.4), transparent)', margin: '50px 0' }} />

          {/* 4. SECTION HUB / LINK SEKSI TERPISAH */}
          <section id="menu-pintu-halaman" style={{ marginBottom: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <h2 style={{ color: '#5409DA', fontSize: '1.6rem', fontWeight: '800', margin: '0' }}>⚡ Layanan & Eksplorasi Informasi Desa</h2>
              <p style={{ color: '#666', fontSize: '0.95rem', margin: '5px 0 0 0' }}>Klik salah satu kartu di bawah untuk membuka halaman informasi terisolasi:</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
              
              {/* APARATUR */}
              <motion.div whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(84, 9, 218, 0.08)' }} style={{ padding: '30px 20px', background: '#ffffff', borderRadius: '20px', border: '2.5px solid #5409DA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
                <div><div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div><h3 style={{ color: '#5409DA', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Perangkat Desa</h3><p style={{ color: '#444444', fontSize: '0.85rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>Kenali lebih dekat jajaran struktural pamong, Kepala Desa, dan staff pelayanan Desa Klanderan.</p></div>
                <a href="/aparatur" style={{ display: 'block', background: '#BBFBFF', color: '#5409DA', textDecoration: 'none', padding: '8px 0', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', border: '1px solid #5409DA' }}>Buka Struktur →</a>
              </motion.div>

              {/* EVENT */}
              <motion.div whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(84, 9, 218, 0.08)' }} style={{ padding: '30px 20px', background: '#ffffff', borderRadius: '20px', border: '2.5px solid #5409DA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
                <div><div style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div><h3 style={{ color: '#5409DA', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Agenda & Event</h3><p style={{ color: '#444444', fontSize: '0.85rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>Kalender kegiatan, sosialisasi program KKN UM 2026, dan musyawarah mufakat warga desa.</p></div>
                <a href="/event" style={{ display: 'block', background: '#BBFBFF', color: '#5409DA', textDecoration: 'none', padding: '8px 0', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', border: '1px solid #5409DA' }}>Buka Agenda →</a>
              </motion.div>

              {/* POTENSI DESA */}
              <motion.div whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(84, 9, 218, 0.08)' }} style={{ padding: '30px 20px', background: '#ffffff', borderRadius: '20px', border: '2.5px solid #5409DA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
                <div><div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌾</div><h3 style={{ color: '#5409DA', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Potensi 3 Sektor</h3><p style={{ color: '#444444', fontSize: '0.85rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>Eksplorasi mendalam interaktif komoditas Wisata alam, Pertanian makro, dan Peternakan terpadu.</p></div>
                <a href="/potensi" style={{ display: 'block', background: '#BBFBFF', color: '#5409DA', textDecoration: 'none', padding: '8px 0', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', border: '1px solid #5409DA' }}>Buka Sektor Potensi →</a>
              </motion.div>

              {/* LAYANAN */}
              <motion.div whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(84, 9, 218, 0.08)' }} style={{ padding: '30px 20px', background: '#ffffff', borderRadius: '20px', border: '2.5px solid #5409DA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
                <div><div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div><h3 style={{ color: '#5409DA', fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px 0' }}>Layanan Publik</h3><p style={{ color: '#444444', fontSize: '0.85rem', margin: '0 0 15px 0', lineHeight: '1.5' }}>Syarat pengurusan dokumen kependudukan, surat pengantar RT/RW dan blanko mandiri administrasi.</p></div>
                <button onClick={() => alert('Loket pengajuan administrasi surat digital sedang disiapkan oleh admin desa Klanderan.')} style={{ display: 'block', width: '100%', background: '#BBFBFF', color: '#5409DA', border: '1px solid #5409DA', padding: '8px 0', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}>Buka Layanan →</button>
              </motion.div>

            </div>
          </section>

        </div>
      </div>

      {/* 5. FOOTER */}
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
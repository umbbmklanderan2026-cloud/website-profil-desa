'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Konfigurasi Klien internal agar kompatibel dengan penarikan data mode client
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
  const [events, setEvents] = useState([])
  const [aparatur, setAparatur] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // Ambil semua data secara asinkron saat halaman dimuat
  useEffect(() => {
    async function fetchData() {
      try {
        const sliderData = await client.fetch(`*[_type == "heroSlider"] | order(urutan asc)`)
        const eventData = await client.fetch(`*[_type == "event"] | order(waktuPelaksanaan asc)`)
        const aparaturData = await client.fetch(`*[_type == "perangkat"] | order(urutan asc)`)
        
        setSliders(sliderData)
        setEvents(eventData)
        setAparatur(aparaturData)
      } catch (error) {
        console.error("Gagal mengambil data dari Sanity:", error)
      }
    }
    fetchData()
  }, [])

  // Efek interval otomatis untuk menggeser foto hero setiap 5 detik
  useEffect(() => {
    if (sliders.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [sliders])

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fcfbfe', minHeight: '100vh', color: '#111', overflowX: 'hidden' }}>
      
      {/* 1. NAVBAR RESPONSIF (OTOMATIS MELIPAT DI HP) */}
      <nav style={{ 
        background: 'rgba(84, 9, 218, 0.95)', 
        backdropFilter: 'blur(10px)', 
        padding: '15px 5%', 
        position: 'sticky', 
        top: '0', 
        zIndex: '1000', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ fontWeight: '900', fontSize: '1.3rem', color: '#BBFBFF', letterSpacing: '1px' }}>
          🏡 DESA KLANDERAN
        </div>
        
        {/* Kontainer Link Menu yang Otomatis Turun ke Bawah jika Layar Sempit */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap', 
          justifyContent: 'center'
        }}>
          {[
            { name: 'Profil', link: '#profil' },
            { name: 'Aparatur', link: '#aparatur' },
            { name: 'Event', link: '#event' },
            { name: 'Potensi', link: '#potensi' },
            { name: 'Layanan', link: '#layanan' },
            { name: 'Kontak', link: '#kontak' }
          ].map((item, idx) => (
            <a 
              key={idx} 
              href={item.link} 
              style={{ 
                textDecoration: 'none', 
                color: '#fff', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                padding: '6px 10px', 
                borderRadius: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)'
                e.target.style.color = '#BBFBFF'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#fff'
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
      </nav>

      {/* 2. HERO SECTION RESPONSIF: SLIDING BACKGROUND IMAGE & TEKS DI TENGAH */}
      <div style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden', background: '#000' }}>
        {/* Layer Efek Animasi Sliding Foto */}
        <AnimatePresence mode="wait">
          {sliders.length > 0 ? (
            <motion.img
              key={currentSlide}
              src={urlFor(sliders[currentSlide].gambar).url()}
              alt="Keindahan Desa Klanderan"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
            />
          ) : (
            /* Tampilan cadangan jika gambar di Sanity Studio belum diisi */
            <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(135deg, #5409DA, #4E71FF)', opacity: 0.6, zIndex: 1 }} />
          )}
        </AnimatePresence>

        {/* Gradasi Estetik Warna Overlay Tone Ungu-Biru */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(78,113,255,0.2) 0%, rgba(84,9,218,0.85) 100%)', zIndex: 2 }} />

        {/* Pembungkus Kotak Teks Informasi Utama Tengah */}
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              background: 'rgba(0, 0, 0, 0.45)', 
              backdropFilter: 'blur(8px)', 
              padding: '30px 5%', 
              borderRadius: '20px', 
              border: '1px solid rgba(255,255,255,0.2)', 
              maxWidth: '850px', 
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: '#BBFBFF', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Selamat Datang Di Portal Resmi
            </span>
            {/* Clamp membuat teks membesar otomatis di laptop dan mengecil di HP agar tidak patah berantakan */}
            <h1 style={{ 
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', 
              fontWeight: '900', 
              margin: '12px 0', 
              lineHeight: '1.25', 
              background: 'linear-gradient(45deg, #FFF, #BBFBFF)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              PEMERINTAH DESA KLANDERAN
            </h1>
            <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', opacity: '0.9', color: '#f5f5f5', margin: '0 0 25px 0', lineHeight: '1.5' }}>
              📍 Kecamatan Plosoklaten, Kabupaten Kediri, Jawa Timur.<br />
              Pusat Informasi Publik, Transparansi Pemerintahan, & Layanan Masyarakat Digital Terpadu.
            </p>
            {/* Tombol Aksi Layanan Responsif */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#layanan" style={{ background: '#4E71FF', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '30px', fontSize: '0.95rem', fontWeight: '700', boxShadow: '0 4px 15px rgba(78,113,255,0.4)' }}>
                🚀 Layanan Publik
              </a>
              <a href="#profil" style={{ background: 'transparent', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '30px', fontSize: '0.95rem', fontWeight: '700', border: '2px solid #fff' }}>
                Pelajari Profil Desa
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CONTAINER LAYOUT KONTEN UTAMA BAWAH */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 5%', boxSizing: 'border-box' }}>

        {/* 3. SEKSI PROFIL, VISI & MISI (OTOMATIS MENJADI 1 KOLOM DI HP) */}
        <section id="profil" style={{ marginBottom: '60px', background: '#fff', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(84,9,218,0.03)', border: '1px solid rgba(84,9,218,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 style={{ color: '#5409DA', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '800', margin: '0 0 8px 0' }}>📖 Visi & Misi Desa</h2>
            <div style={{ width: '60px', height: '4px', background: '#4E71FF', margin: '0 auto', borderRadius: '2px' }} />
          </div>
          
          {/* Menggunakan auto-fit agar layout fleksibel menyesuaikan lebar layar hp/laptop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '25px' }}>
            <div style={{ background: 'linear-gradient(135deg, #5409DA 0%, #4E71FF 100%)', padding: '25px', borderRadius: '16px', color: '#fff', boxShadow: '0 6px 20px rgba(84,9,218,0.15)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#BBFBFF', fontWeight: '700' }}>✨ Visi Utama</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', fontStyle: 'italic', opacity: '0.95', margin: '0' }}>
                "Mewujudkan tata kelola Pemerintahan Desa Klanderan yang bersih, transparan, akuntabel, dan bermartabat guna mencapai masyarakat yang maju, sejahtera, religius, serta unggul di bidang agraris."
              </p>
            </div>

            <div style={{ background: '#f8faff', padding: '25px', borderRadius: '16px', borderLeft: '6px solid #5409DA', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#5409DA', fontWeight: '700' }}>🎯 Misi Desa</h3>
              <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '0.95rem', lineHeight: '1.7', color: '#444' }}>
                <li>Meningkatkan kualitas SDM aparatur dalam percepatan reformasi birokrasi digital.</li>
                <li>Mendorong efisiensi transparansi dana desa secara terbuka melalui portal sistem informasi.</li>
                <li>Meningkatkan kualitas infrastruktur jalan perkebunan dan pertanian desa Klanderan.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. SEKSI STRUKTUR ORGANISASI / APARATUR DESA */}
        <section id="aparatur" style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 style={{ color: '#5409DA', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '800', margin: '0 0 8px 0' }}>👥 Perangkat Pemerintah Desa</h2>
            <div style={{ width: '60px', height: '4px', background: '#4E71FF', margin: '0 auto', borderRadius: '2px' }} />
          </div>
          
          {aparatur.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>Data struktur pemerintahan desa sedang dipersiapkan.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {aparatur.map((p) => (
                <div key={p._id} style={{ border: '1px solid #eee', borderRadius: '16px', padding: '20px', textAlign: 'center', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                  <div style={{ width: '110px', height: '110px', margin: '0 auto 15px auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid #4E71FF', boxShadow: '0 4px 10px rgba(78,113,255,0.15)' }}>
                    {p.foto ? (
                      <img src={urlFor(p.foto).url()} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '2rem' }}>👤</div>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#111', fontWeight: '700' }}>{p.nama}</h3>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#5409DA', fontWeight: '700', textTransform: 'uppercase' }}>{p.jabatan}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. SEKSI EVENT & AGENDA DESA */}
        <section id="event" style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 style={{ color: '#5409DA', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '800', margin: '0 0 8px 0' }}>📅 Event & Agenda Mendatang</h2>
            <div style={{ width: '60px', height: '4px', background: '#4E71FF', margin: '0 auto', borderRadius: '2px' }} />
          </div>
          
          {events.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>Belum ada agenda kegiatan dalam waktu dekat.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '25px' }}>
              {events.map((event) => (
                <div key={event._id} style={{ border: '1px solid #eee', borderRadius: '16px', padding: '20px', background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.015)' }}>
                  {event.pamflet && (
                    <img src={urlFor(event.pamflet).url()} alt={event.judulEvent} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} />
                  )}
                  <h3 style={{ margin: '0 0 10px 0', color: '#111', fontWeight: '700', fontSize: '1.2rem', lineHeight: '1.3' }}>{event.judulEvent}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#4E71FF', fontWeight: '700', margin: '5px 0' }}>📍 {event.lokasi}</p>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0' }}>
                    🕒 {new Date(event.waktuPelaksanaan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                  </p>
                  {event.deskripsi && (
                    <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5', marginTop: '12px', borderTop: '1px dashed #eee', paddingTop: '12px', marginBotoom: '0' }}>{event.deskripsi}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. TEMPAT PENGEMBANGAN FITUR POTENSI, LAYANAN, BERITA (DOKUMENTASI) */}
        <section id="potensi" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div id="dokumentasi" style={{ padding: '25px', background: '#fff', borderRadius: '16px', border: '1px solid #eee', textAlign: 'center' }}>
              <h3 style={{ color: '#5409DA', fontSize: '1.1rem', margin: '0 0 8px 0' }}>📸 Berita & Dokumentasi</h3>
              <p style={{ color: '#666', fontSize: '0.85rem', margin: '0' }}>Kumpulan galeri foto dan artikel berita program kerja KKN mahasiswa UM 2026 di Desa Klanderan.</p>
            </div>
            <div style={{ padding: '25px', background: '#fff', borderRadius: '16px', border: '1px solid #eee', textAlign: 'center' }}>
              <h3 style={{ color: '#5409DA', fontSize: '1.1rem', margin: '0 0 8px 0' }}>🌾 Sektor Potensi Desa</h3>
              <p style={{ color: '#666', fontSize: '0.85rem', margin: '0' }}>Informasi komoditas utama pertanian, peternakan, serta produk UMKM unggulan warga Klanderan.</p>
            </div>
            <div id="layanan" style={{ padding: '25px', background: '#fff', borderRadius: '16px', border: '1px solid #eee', textAlign: 'center' }}>
              <h3 style={{ color: '#5409DA', fontSize: '1.1rem', margin: '0 0 8px 0' }}>📁 Loket Layanan Publik</h3>
              <p style={{ color: '#666', fontSize: '0.85rem', margin: '0' }}>Panduan dan berkas persyaratan mandiri pengajuan surat pengantar RT/RW dan administrasi kependudukan.</p>
            </div>
          </div>
        </section>

      </div>

      {/* 7. KAKI HALAMAN (FOOTER) RESPONSIF DENGAN TONE KONSISTEN */}
      <footer id="kontak" style={{ background: '#5409DA', color: '#fff', padding: '40px 5%', textAlign: 'center', borderTop: '6px solid #8DD8FF' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#BBFBFF', fontSize: '1.3rem', fontWeight: '700' }}>Pemerintah Desa Klanderan Resmi</h3>
        <p style={{ margin: '4px 0', opacity: '0.85', fontSize: '0.95rem' }}>Kantor Balai Desa Klanderan, Kec. Plosoklaten, Kabupaten Kediri, Jawa Timur</p>
        <p style={{ margin: '4px 0', opacity: '0.85', fontSize: '0.85rem', color: '#BBFBFF' }}>📧 kontak@desaklanderan.id | 📞 WhatsApp Layanan: 0812-XXXX-XXXX</p>
        <div style={{ margin: '20px auto 0 auto', width: '60px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
        <p style={{ margin: '15px 0 0 0', fontSize: '0.8rem', color: '#8DD8FF' }}>&copy; 2026 Tim KKN Universitas Negeri Malang. All Rights Reserved.</p>
      </footer>

    </div>
  )
}
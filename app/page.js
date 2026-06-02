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
      const sliderData = await client.fetch(`*[_type == "heroSlider"] | order(urutan asc)`)
      const eventData = await client.fetch(`*[_type == "event"] | order(waktuPelaksanaan asc)`)
      const aparaturData = await client.fetch(`*[_type == "perangkat"] | order(urutan asc)`)
      
      setSliders(sliderData)
      setEvents(eventData)
      setAparatur(aparaturData)
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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fcfbfe', minHeight: '100vh', color: '#111', scrollBehavior: 'smooth' }}>
      
      {/* 1. STICKY NAVBAR DENGAN TONE GRADASI TRANSPARAN */}
      <nav style={{ background: 'rgba(84, 9, 218, 0.95)', backdropFilter: 'blur(10px)', padding: '20px 40px', position: 'sticky', top: '0', zIndex: '1000', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
        <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#BBFBFF', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏡 DESA KLANDERAN
        </div>
        <div style={{ display: 'flex', gap: '25px' }}>
          {[
            { name: 'Profil & Visi Misi', link: '#profil' },
            { name: 'Struktur Organisasi', link: '#aparatur' },
            { name: 'Event Mendatang', link: '#event' },
            { name: 'Berita & Dokumentasi', link: '#dokumentasi' },
            { name: 'Potensi Desa', link: '#potensi' },
            { name: 'Layanan Publik', link: '#layanan' },
            { name: 'Kontak', link: '#kontak' }
          ].map((item, idx) => (
            <a 
              key={idx} 
              href={item.link} 
              style={{ textDecoration: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: '600', transition: 'color 0.2s', padding: '5px 10px', borderRadius: '6px' }}
              onMouseEnter={(e) => e.target.style.color = '#8DD8FF'}
              onMouseLeave={(e) => e.target.style.color = '#fff'}
            >
              {item.name}
            </a>
          ))}
        </div>
      </nav>

      {/* 2. HERO SECTION: SLIDING IMAGE BACKGROUND & IDENTITAS UTAMA */}
      <div style={{ position: 'relative', width: '100%', height: '85vh', overflow: 'hidden', background: '#000' }}>
        {/* Lapisan Sliding Gambar Menggunakan Framer Motion */}
        <AnimatePresence mode="wait">
          {sliders.length > 0 && (
            <motion.img
              key={currentSlide}
              src={urlFor(sliders[currentSlide].gambar).url()}
              alt="Keindahan Desa"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.55, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
            />
          )}
        </AnimatePresence>

        {/* Gradasi Estetik Pemotong Layar Sesuai Gambar Inspirasi */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(78,113,255,0.2) 0%, rgba(84,9,218,0.85) 100%)', zIndex: 2 }} />

        {/* Konten Teks Identitas Tengah (Mirip Gambar Screenshot 2026-06-02 120216.jpg) */}
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#fff', textAlign: 'center', padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)', padding: '40px 60px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', maxWidth: '800px' }}
          >
            <span style={{ fontSize: '1.1rem', color: '#BBFBFF', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>Selamat Datang Di Website Resmi</span>
            <h1 style={{ fontSize: '3.8rem', fontWeight: '900', margin: '10px 0 15px 0', lineHeight: '1.2', background: 'linear-gradient(45deg, #FFF, #BBFBFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DESA KLANDERAN
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: '0.9', fontWeight: '400', color: '#f0f0f0' }}>
              📍 Kec. Plosoklaten, Kabupaten Kediri, Jawa Timur. Pusat Keterbukaan Informasi, Layanan Mandiri, Publikasi Kegiatan Digital Terpadu.
            </p>
            <div style={{ marginTop: '25px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <a href="#layanan" style={{ background: '#4E71FF', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '30px', fontWeight: '700', boxShadow: '0 4px 15px rgba(78,113,255,0.4)', transition: 'all 0.2s' }}>
                🚀 Ajukan Layanan Publik
              </a>
              <a href="#profil" style={{ background: 'transparent', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '30px', fontWeight: '700', border: '2px solid #fff', transition: 'all 0.2s' }}>
                Pelajari Profil Desa
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CONTAINER LAYOUT KONTEN BAWAH */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

        {/* 3. SEKSI PROFIL, VISI & MISI DENGAN BLEND TONE #5409DA */}
        <section id="profil" style={{ marginBottom: '80px', background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(84,9,218,0.04)', border: '1px solid rgba(84,9,218,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#5409DA', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 10px 0' }}>📖 Visi & Misi Kepala Desa</h2>
            <div style={{ width: '80px', height: '4px', background: '#4E71FF', margin: '0 auto', borderRadius: '2px' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            <motion.div whileHover={{ y: -5 }} style={{ background: 'linear-gradient(135deg, #5409DA 0%, #4E71FF 100%)', padding: '30px', borderRadius: '16px', color: '#fff', boxShadow: '0 8px 25px rgba(84,9,218,0.2)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.4rem', color: '#BBFBFF', fontWeight: '700' }}>✨ Visi Utama</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', fontStyle: 'italic', opacity: '0.95' }}>
                "Mewujudkan tata kelola Pemerintahan Desa Klanderan yang bersih, transparan, akuntabel, dan bermartabat guna mencapai masyarakat yang maju, sejahtera, religius, serta unggul di bidang agraris."
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} style={{ background: '#f8faff', padding: '30px', borderRadius: '16px', borderLeft: '6px solid #5409DA', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.4rem', color: '#5409DA', fontWeight: '700' }}>🎯 Misi Desa</h3>
              <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '1rem', lineHeight: '1.8', color: '#444' }}>
                <li>Meningkatkan kualitas SDM aparatur dalam percepatan reformasi birokrasi digital.</li>
                <li>Mendorong efisiensi transparansi dana desa secara terbuka melalui portal sistem informasi.</li>
                <li>Meningkatkan kualitas infrastruktur jalan perkebunan dan pertanian desa Klanderan.</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* 4. SEKSI STRUKTUR ORGANISASI / APARATUR */}
        <section id="aparatur" style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#5409DA', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 10px 0' }}>👥 Perangkat & Pemerintah Desa</h2>
            <div style={{ width: '80px', height: '4px', background: '#4E71FF', margin: '0 auto', borderRadius: '2px' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '30px' }}>
            {aparatur.map((p) => (
              <motion.div key={p._id} whileHover={{ scale: 1.03 }} style={{ border: '1px solid #eee', borderRadius: '16px', padding: '25px', textAlign: 'center', background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '130px', height: '130px', margin: '0 auto 20px auto', borderRadius: '50%', overflow: 'hidden', border: '4px solid #4E71FF', boxShadow: '0 4px 10px rgba(78,113,255,0.2)' }}>
                  {p.foto ? (
                    <img src={urlFor(p.foto).url()} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '2.5rem' }}>👤</div>
                  )}
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#111', fontWeight: '700' }}>{p.nama}</h3>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#5409DA', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.jabatan}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. SEKSI EVENT DESA */}
        <section id="event" style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: '#5409DA', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 10px 0' }}>📅 Event & Agenda Mendatang</h2>
            <div style={{ width: '80px', height: '4px', background: '#4E71FF', margin: '0 auto', borderRadius: '2px' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
            {events.map((event) => (
              <div key={event._id} style={{ border: '1px solid #eee', borderRadius: '16px', padding: '20px', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                {event.pamflet && (
                  <img src={urlFor(event.pamflet).url()} alt={event.judulEvent} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} />
                )}
                <h3 style={{ margin: '0 0 10px 0', color: '#111', fontWeight: '700', fontSize: '1.3rem' }}>{event.judulEvent}</h3>
                <p style={{ fontSize: '0.95rem', color: '#4E71FF', fontWeight: '700', margin: '5px 0' }}>📍 {event.lokasi}</p>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>
                  🕒 {new Date(event.waktuPelaksanaan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                </p>
                {event.deskripsi && (
                  <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.6', marginTop: '12px', borderTop: '1px dashed #eee', paddingTop: '12px' }}>{event.deskripsi}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6. PLACEHOLDER HALAMAN DINAMIS LAINNYA (MENYUSUL) */}
        <section id="potensi" style={{ marginBottom: '60px', padding: '40px', background: '#fff', borderRadius: '16px', border: '1px dashed #4E71FF', textAlign: 'center' }}>
          <h3 style={{ color: '#5409DA', margin: '0 0 10px 0' }}>🌾 Potensi Desa, Layanan Publik, & Berita</h3>
          <p style={{ color: '#666', margin: '0' }}>Bagian database integrasi konten berita KKN, potensi pertanian, dan loket pengajuan surat digital sedang dalam pengembangan lokal.</p>
        </section>

      </div>

      {/* 7. KAKI HALAMAN (FOOTER) DENGAN PALET TERPILIH */}
      <footer id="kontak" style={{ background: '#5409DA', color: '#fff', padding: '50px 40px', textAlign: 'center', borderTop: '6px solid #8DD8FF' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#BBFBFF', fontSize: '1.4rem' }}>Pemerintah Desa Klanderan Resmi</h3>
        <p style={{ margin: '5px 0', opacity: '0.85' }}>Kantor Balai Desa Klanderan, Kec. Plosoklaten, Kabupaten Kediri, Jawa Timur</p>
        <p style={{ margin: '5px 0', opacity: '0.85', fontSize: '0.9rem' }}>📧 kontak@desaklanderan.id | 📞 WhatsApp Layanan: 0812-XXXX-XXXX</p>
        <div style={{ margin: '25px auto 0 auto', width: '100px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
        <p style={{ margin: '20px 0 0 0', fontSize: '0.85rem', color: '#8DD8FF' }}>&copy; 2026 Tim KKN Universitas Negeri Malang. All Rights Reserved.</p>
      </footer>

    </div>
  )
}
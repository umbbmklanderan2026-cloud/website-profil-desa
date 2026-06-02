'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

// 1. Definisi Variasi Animasi untuk Kontainer Grid (Stagger Effect)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15 // Membuat kartu muncul bergantian satu per satu dengan jeda 0.15 detik
    }
  }
}

// 2. Definisi Variasi Animasi untuk Masing-masing Kartu Perangkat
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40 // Posisi awal agak ke bawah
  },
  show: { 
    opacity: 1, 
    y: 0, // Naik ke posisi asli
    transition: { 
      type: 'spring', 
      stiffness: 60, 
      damping: 15 
    } 
  }
}

export default function AparaturPage() {
  const [aparatur, setAparatur] = useState([])

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
      
      {/* NAVBAR GLASSMORPHIC */}
      <nav style={{ 
        background: 'rgba(187, 251, 255, 0.75)', 
        backdropFilter: 'blur(12px)', 
        WebkitBackdropFilter: 'blur(12px)',
        padding: '15px 5%', 
        position: 'sticky', 
        top: '0', 
        zIndex: '1000', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '2px solid rgba(84, 9, 218, 0.4)',
        boxShadow: '0 4px 20px rgba(84, 9, 218, 0.03)'
      }}>
        <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#5409DA' }}>🏡 DESA KLANDERAN</div>
        <motion.a 
          href="/" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ textDecoration: 'none', color: '#5409DA', fontSize: '0.9rem', fontWeight: '800', background: '#ffffff', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(84, 9, 218, 0.15)', border: '1px solid rgba(84, 9, 218, 0.2)', transition: 'all 0.2s' }}
        >
          ← Kembali ke Beranda
        </motion.a>
      </nav>

      {/* BANNER UTAMA DENGAN ANIMASI FADE DOWN */}
      <div style={{ background: 'linear-gradient(135deg, #BBFBFF 0%, #ffffff 100%)', padding: '60px 20px', textAlign: 'center', borderBottom: '1px solid #BBFBFF' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: '#5409DA', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '900', margin: '0 0 10px 0' }}
        >
          👥 Struktur Organisasi & Perangkat Desa
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ color: '#444444', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', fontWeight: '500', maxWidth: '700px', margin: '0 auto', lineHeight: '1.5' }}
        >
          Aparatur Pemerintah Desa Klanderan yang siap melayani kebutuhan administrasi dan transformasi digital warga dengan prima.
        </motion.p>
      </div>

      {/* AREA GRID KARTU PERANGKAT DESA YANG ANIMATIF */}
      <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '0 5%', boxSizing: 'border-box' }}>
        {aparatur.length === 0 ? (
          <p style={{ color: '#888888', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>Menghubungkan ke database Sanity...</p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show" // Memicu animasi ketika area grid masuk ke layar saat di-scroll
            viewport={{ once: true, margin: "-100px" }} // Animasi hanya berjalan 1 kali agar tidak melelahkan mata pengunjung
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '30px' 
            }}
          >
            {aparatur.map((p) => (
              <motion.div 
                key={p._id}
                variants={cardVariants} // Mengikuti logika fade-in stagger dari parent
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  boxShadow: '0 12px 30px rgba(84, 9, 218, 0.08)',
                  borderColor: '#5409DA'
                }} 
                style={{ 
                  border: '2px solid #BBFBFF', 
                  borderRadius: '24px', 
                  padding: '35px 20px', 
                  textAlign: 'center', 
                  background: '#ffffff', 
                  boxShadow: '0 4px 15px rgba(84,9,218,0.01)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                {/* Pembungkus Foto Lingkaran */}
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  margin: '0 auto 20px auto', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  border: '4px solid #BBFBFF', 
                  boxShadow: '0 4px 12px rgba(84,9,218,0.06)' 
                }}>
                  {p.foto ? (
                    <img src={urlFor(p.foto).url()} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '2.5rem' }}>👤</div>
                  )}
                </div>

                {/* Teks Nama & Jabatan */}
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#111111', fontWeight: '800', lineHeight: '1.3' }}>
                  {p.nama}
                </h3>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#5409DA', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {p.jabatan}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* FOOTER MINI */}
      <footer style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #f6f8fc 100%)', color: '#888888', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #eee', marginTop: '8px' }}>
        <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: '600' }}>&copy; 2026 Tim KKN Universitas Negeri Malang. All Rights Reserved.</p>
      </footer>

    </div>
  )
}
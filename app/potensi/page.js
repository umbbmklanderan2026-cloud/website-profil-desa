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

export default function PotensiPage() {
  const [potensiData, setPotensiData] = useState([])
  const [activeTab, setActiveTab] = useState('wisata')

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
      
      {/* NAVBAR SEDERHANA KEMBALI KE BERANDA */}
      <nav style={{ 
        background: 'rgba(187, 251, 255, 0.85)', 
        backdropFilter: 'blur(12px)', 
        padding: '15px 5%', 
        position: 'sticky', 
        top: '0', 
        zIndex: '1000', 
        boxShadow: '0 4px 20px rgba(84, 9, 218, 0.05)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '2px solid rgba(84, 9, 218, 0.4)'
      }}>
        <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#5409DA' }}>
          🏡 DESA KLANDERAN
        </div>
        <a href="/" style={{ textDecoration: 'none', color: '#5409DA', fontSize: '0.9rem', fontWeight: '800', background: '#ffffff', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(84, 9, 218, 0.15)', transition: 'all 0.2s' }}>
          ← Kembali ke Beranda
        </a>
      </nav>

      {/* MINI HERO BANNER HALAMAN POTENSI */}
      <div style={{ background: 'linear-gradient(135deg, #BBFBFF 0%, #ffffff 100%)', padding: '50px 20px', textAlign: 'center', borderBottom: '1px solid #BBFBFF' }}>
        <h1 style={{ color: '#5409DA', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 10px 0' }}>🌾 Sektor Potensi Desa</h1>
        <p style={{ color: '#444444', fontSize: '1.05rem', maxWidh: '600px', margin: '0 auto', fontWeight: '500' }}>
          Eksplorasi kekayaan alam, komoditas unggulan agraris, dan destinasi lokal Desa Klanderan Plosoklaten.
        </p>
      </div>

      {/* AREA UTAMA: 1 BORDER UTAMA DENGAN 3 PILIHAN TAB INTERAKTIF */}
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', boxSizing: 'border-box' }}>
        
        <div style={{ 
          border: '3px solid #5409DA', // Border utama tegas aksen 5409DA
          borderRadius: '24px', 
          padding: '30px', 
          background: '#ffffff',
          boxShadow: '0 12px 40px rgba(84, 9, 218, 0.06)'
        }}>
          
          {/* Pilihan Navigasi Tab 3 Sektor di dalam Border Utama */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            background: '#BBFBFF', 
            padding: '8px', 
            borderRadius: '16px', 
            marginBottom: '30px' 
          }}>
            {['wisata', 'pertanian', 'peternakan'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  background: activeTab === tab ? '#5409DA' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#5409DA',
                  transition: 'all 0.25s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Area Konten: Grid Foto dan Penjelasan Sektor */}
          <div style={{ minHeight: '300px' }}>
            <AnimatePresence mode="wait">
              {filteredPotensi.length === 0 ? (
                <motion.p 
                  key="empty" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  style={{ color: '#777777', fontStyle: 'italic', textAlign: 'center', marginTop: '100px' }}
                >
                  Belum ada data visual untuk sektor {activeTab}. Silakan tambahkan dokumen baru melalui Sanity Studio.
                </motion.p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                  {filteredPotensi.map((item) => (
                    <motion.div 
                      key={item._id} 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0 }} 
                      transition={{ duration: 0.3 }} 
                      style={{ 
                        background: '#ffffff', 
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        border: '1px solid #BBFBFF', 
                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
                      }}
                    >
                      <img 
                        src={urlFor(item.foto).url()} 
                        alt={item.namaItem} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                      />
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#5409DA', fontWeight: '800', fontSize: '1.2rem' }}>
                          {item.namaItem}
                        </h3>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#444444', lineHeight: '1.6', textAlign: 'justify' }}>
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

      {/* FOOTER OFF-WHITE */}
      <footer style={{ background: '#f6f8fc', color: '#888888', padding: '30px 20px', textAlign: 'center', borderTop: '1px solid #eee', marginTop: '60px' }}>
        <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: '600' }}>&copy; 2026 Tim KKN Universitas Negeri Malang. All Rights Reserved.</p>
      </footer>

    </div>
  )
}
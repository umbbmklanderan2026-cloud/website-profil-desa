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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#ffffff', minHeight: '100vh', color: '#222222' }}>
      
      {/* NAVBAR */}
      <nav style={{ background: 'rgba(187, 251, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '15px 5%', position: 'sticky', top: '0', zIndex: '1000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(84, 9, 218, 0.4)' }}>
        <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#5409DA' }}>🏡 DESA KLANDERAN</div>
        <a href="/" style={{ textDecoration: 'none', color: '#5409DA', fontSize: '0.9rem', fontWeight: '800', background: '#ffffff', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(84, 9, 218, 0.15)' }}>← Kembali ke Beranda</a>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #BBFBFF 0%, #ffffff 100%)', padding: '50px 20px', textAlign: 'center', borderBottom: '1px solid #BBFBFF' }}>
        <h1 style={{ color: '#5409DA', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 10px 0' }}>👥 Struktur Organisasi & Perangkat Desa</h1>
        <p style={{ color: '#444444', fontSize: '1.05rem', fontWeight: '500' }}>Aparatur Pemerintah Desa Klanderan yang siap melayani kebutuhan administrasi warga dengan prima.</p>
      </div>

      {/* GRID APARATUR */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 5%', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
          {aparatur.map((p) => (
            <motion.div key={p._id} whileHover={{ y: -5 }} style={{ border: '2px solid #BBFBFF', borderRadius: '20px', padding: '30px 20px', textAlign: 'center', background: '#ffffff', boxShadow: '0 4px 15px rgba(84,9,218,0.02)' }}>
              <div style={{ width: '120px', height: '120px', margin: '0 auto 20px auto', borderRadius: '50%', overflow: 'hidden', border: '4px solid #BBFBFF', boxShadow: '0 4px 12px rgba(84,9,218,0.08)' }}>
                {p.foto ? (
                  <img src={urlFor(p.foto).url()} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '2.5rem' }}>👤</div>
                )}
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#111111', fontWeight: '700' }}>{p.nama}</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#5409DA', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.jabatan}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
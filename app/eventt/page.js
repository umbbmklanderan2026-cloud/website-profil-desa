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

export default function EventPage() {
  const [events, setEvents] = useState([])

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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#ffffff', minHeight: '100vh', color: '#222222' }}>
      
      {/* NAVBAR */}
      <nav style={{ background: 'rgba(187, 251, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '15px 5%', position: 'sticky', top: '0', zIndex: '1000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(84, 9, 218, 0.4)' }}>
        <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#5409DA' }}>🏡 DESA KLANDERAN</div>
        <a href="/" style={{ textDecoration: 'none', color: '#5409DA', fontSize: '0.9rem', fontWeight: '800', background: '#ffffff', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(84, 9, 218, 0.15)' }}>← Kembali ke Beranda</a>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #BBFBFF 0%, #ffffff 100%)', padding: '50px 20px', textAlign: 'center', borderBottom: '1px solid #BBFBFF' }}>
        <h1 style={{ color: '#5409DA', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 10px 0' }}>📅 Agenda & Kegiatan Desa</h1>
        <p style={{ color: '#444444', fontSize: '1.05rem', fontWeight: '500' }}>Ikuti dan pantau seluruh rangkaian pengumuman, sosialisasi, dan festival mendatang di lingkungan Desa Klanderan.</p>
      </div>

      {/* GRID EVENT */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 5%', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {events.map((event) => (
            <motion.div key={event._id} whileHover={{ y: -4 }} style={{ border: '2px solid #BBFBFF', borderRadius: '24px', padding: '20px', background: '#ffffff', boxShadow: '0 6px 20px rgba(0,0,0,0.01)' }}>
              {event.pamflet && (
                <img src={urlFor(event.pamflet).url()} alt={event.judulEvent} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '15px' }} />
              )}
              <h3 style={{ margin: '0 0 10px 0', color: '#5409DA', fontWeight: '800', fontSize: '1.3rem', lineHeight: '1.4' }}>{event.judulEvent}</h3>
              <p style={{ fontSize: '0.95rem', color: '#222222', fontWeight: '700', margin: '5px 0' }}>📍 {event.lokasi}</p>
              <p style={{ fontSize: '0.85rem', color: '#666666', margin: '5px 0' }}>🕒 {new Date(event.waktuPelaksanaan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB</p>
              {event.deskripsi && (
                <p style={{ fontSize: '0.85rem', color: '#555555', lineHeight: '1.6', marginTop: '12px', borderTop: '1px solid #BBFBFF', paddingTop: '12px', marginBottom: '0', textAlign: 'justify' }}>{event.deskripsi}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
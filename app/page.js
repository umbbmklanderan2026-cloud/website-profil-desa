import { client, urlFor } from '../client'

// 1. Fungsi mengambil data agenda kegiatan
async function getEvents() {
  const query = `*[_type == "event"] | order(waktuPelaksanaan asc)`
  const data = await client.fetch(query)
  return data
}

// 2. Fungsi mengambil data aparatur desa urut berdasarkan nomor urut
async function getAparatur() {
  const query = `*[_type == "perangkat"] | order(urutan asc)`
  const data = await client.fetch(query)
  return data
}

export default async function Home() {
  // Menjalankan kedua pengambilan data secara paralel
  const [events, aparatur] = await Promise.all([getEvents(), getAparatur()])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '1200px', margin: '0 auto', color: '#111' }}>
      
      {/* KOP HEADLINE WEBSITE */}
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#0056b3', fontSize: '2.5rem', fontWeight: '800' }}>Selamat Datang di Portal Desa Klanderan</h1>
        <p style={{ color: '#555', fontSize: '1.1rem' }}>Informasi terkini, agenda kegiatan, dan layanan publik digital desa.</p>
      </header>

      <hr style={{ border: '0', height: '1px', background: '#e0e0e0', margin: '40px 0' }} />

      {/* SEKSI 1: AGENDA & EVENT DESA */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#333', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          📅 Agenda & Event Desa Mendatang
        </h2>
        
        {events.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>Belum ada agenda kegiatan dalam waktu dekat.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
            {events.map((event) => (
              <div key={event._id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', background: '#fff' }}>
                {event.pamflet && (
                  <img 
                    src={urlFor(event.pamflet).url()} 
                    alt={event.judulEvent} 
                    style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                  />
                )}
                <h3 style={{ margin: '0 0 10px 0', color: '#000000', fontWeight: '700', fontSize: '1.3rem', lineHeight: '1.4' }}>
                  {event.judulEvent}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#e44d26', fontWeight: 'bold', margin: '6px 0' }}>
                  📍 {event.lokasi}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#555', margin: '6px 0' }}>
                  🕒 {new Date(event.waktuPelaksanaan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                </p>
                {event.deskripsi && (
                  <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5', marginTop: '12px', borderTop: '1px dashed #eee', paddingTop: '12px' }}>
                    {event.deskripsi}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <hr style={{ border: '0', height: '1px', background: '#e0e0e0', margin: '40px 0' }} />

      {/* SEKSI 2: STRUKTUR ORGANISASI / APARATUR DESA */}
      <section>
        <h2 style={{ color: '#333', marginBottom: '25px' }}>👥 Aparatur & Pemerintah Desa</h2>
        
        {aparatur.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>Data struktur pemerintahan desa sedang dipersiapkan oleh admin.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
            {aparatur.map((p) => (
              <div key={p._id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', textAlign: 'center', background: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '120px', height: '120px', margin: '0 auto 15px auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid #0056b3' }}>
                  {p.foto ? (
                    <img 
                      src={urlFor(p.foto).url()} 
                      alt={p.nama} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '2rem' }}>
                      👤
                    </div>
                  )}
                </div>
                <h3 style={{ margin: '10px 0 5px 0', fontSize: '1.15rem', color: '#111', fontWeight: '700' }}>{p.nama}</h3>
                <p style={{ margin: '0', fontSize: '0.95rem', color: '#0056b3', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {p.jabatan}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
export default {
    name: 'event',
    type: 'document',
    title: 'Agenda & Event Desa',
    fields: [
      {
        name: 'judulEvent',
        type: 'string',
        title: 'Judul Kegiatan',
        description: 'Contoh: Jalan Sehat HUT RI, Penyaluran BLT, atau Rapat Pleno',
        validation: Rule => Rule.required().error('Judul kegiatan wajib diisi!')
      },
      {
        name: 'waktuPelaksanaan',
        type: 'datetime',
        title: 'Tanggal & Waktu Acara',
        description: 'Pilih tanggal dan jam dimulainya kegiatan desa',
        validation: Rule => Rule.required().error('Tanggal pelaksanaan wajib ditentukan!')
      },
      {
        name: 'lokasi',
        type: 'string',
        title: 'Lokasi Kegiatan',
        description: 'Contoh: Balai Desa Klanderan, Dusun A, atau Lapangan Desa',
        validation: Rule => Rule.required().error('Lokasi kegiatan tidak boleh kosong!')
      },
      {
        name: 'deskripsi',
        type: 'text',
        title: 'Detail/Deskripsi Kegiatan',
        description: 'Tuliskan rincian acara, ketentuan pakaian, atau berkas yang harus dibawa warga'
      },
      {
        name: 'pamflet',
        type: 'image',
        title: 'Foto / Pamflet Acara',
        description: 'Unggah brosur atau dokumentasi pendukung (opsional)',
        options: {
          hotspot: true // Membantu memotong gambar secara otomatis agar proporsional
        }
      }
    ]
  }
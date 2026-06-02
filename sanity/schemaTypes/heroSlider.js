export default {
    name: 'heroSlider',
    type: 'document',
    title: 'Slider Keindahan Desa',
    fields: [
      {
        name: 'judul',
        type: 'string',
        title: 'Keterangan Singkat Foto',
        validation: Rule => Rule.required()
      },
      {
        name: 'gambar',
        type: 'image',
        title: 'Foto Lanskap Desa',
        options: { hotspot: true },
        validation: Rule => Rule.required()
      },
      {
        name: 'urutan',
        type: 'number',
        title: 'Urutan Tampil'
      }
    ]
  }
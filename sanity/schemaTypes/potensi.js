export default {
    name: 'potensi',
    type: 'document',
    title: 'Potensi Desa',
    fields: [
      {
        name: 'sektor',
        type: 'string',
        title: 'Sektor Potensi',
        options: {
          list: [
            { title: 'Wisata', value: 'wisata' },
            { title: 'Pertanian', value: 'pertanian' },
            { title: 'Peternakan', value: 'peternakan' },
          ],
        },
        validation: Rule => Rule.required()
      },
      {
        name: 'namaItem',
        type: 'string',
        title: 'Nama Potensi / Komoditas',
        validation: Rule => Rule.required()
      },
      {
        name: 'foto',
        type: 'image',
        title: 'Foto Potensi',
        options: { hotspot: true },
        validation: Rule => Rule.required()
      },
      {
        name: 'penjelasan',
        type: 'text',
        title: 'Penjelasan / Deskripsi',
        validation: Rule => Rule.required()
      }
    ]
  }
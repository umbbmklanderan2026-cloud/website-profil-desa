export default {
    name: 'perangkat',
    type: 'document',
    title: 'Aparatur Desa',
    fields: [
      {
        name: 'nama',
        type: 'string',
        title: 'Nama Lengkap',
        validation: Rule => Rule.required().error('Nama harus diisi!')
      },
      {
        name: 'jabatan',
        type: 'string',
        title: 'Jabatan',
        description: 'Contoh: Kepala Desa, Sekretaris Desa, Kasie Pelayanan',
        validation: Rule => Rule.required().error('Jabatan harus ditentukan!')
      },
      {
        name: 'foto',
        type: 'image',
        title: 'Foto Profil',
        options: { hotspot: true }
      },
      {
        name: 'urutan',
        type: 'number',
        title: 'Nomor Urut Tampilan',
        description: 'Gunakan angka (1 untuk Kades, 2 untuk Sekdes, dst) agar urutannya rapi di website'
      }
    ]
  }
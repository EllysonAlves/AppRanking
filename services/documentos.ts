export type Documento = {
    id: number;
    titulo: string;
    descricao: string;
    tipo: 'pdf' | 'word' | 'imagem';
    url: string;
  };
  
  export const documentos: Documento[] = [
    {
      id: 1,
      titulo: 'Provisionar ONU/ONT',
      descricao: 'Tutorial completo sobre como provisionar uma ONU/ONT',
      tipo: 'pdf',
      url: 'https://drive.google.com/file/d/1wnBplehYL_96XrRoWN617HFbL5y4nTZe/view?usp=sharing',
    },
    {
      id: 2,
      titulo: 'Configuração ONU Huawei',
      descricao: 'Tutorial completo sobre a configuração da ONU EG8145X6.',
      tipo: 'pdf',
      url: 'https://exemplo.com/documento1.pdf',
    },
    {
      id: 3,
      titulo: 'Checklist de instalação',
      descricao: 'Documento de apoio para técnicos em campo.',
      tipo: 'word',
      url: 'https://exemplo.com/documento2.docx',
    },
    {
      id: 4,
      titulo: 'Topologia de rede interna',
      descricao: 'Imagem explicando a arquitetura da rede doméstica.',
      tipo: 'imagem',
      url: 'https://exemplo.com/imagem.jpg',
    },
  ];
  
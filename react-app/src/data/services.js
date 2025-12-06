export const services = [
  {
    id: 'wardrobes',
    nameEn: 'Wardrobes / Walk-in Closets',
    nameAr: 'خزانات تبديل',
    options: [
      { id: 'wooden-doors', labelEn: 'Wooden Doors', labelAr: 'ابواب خشب', type: 'checkbox' },
      { id: 'aluminum-glass', labelEn: 'Aluminum w/ Clear Glass', labelAr: 'المنيوم مع زجاج شفاف', type: 'checkbox' },
      { id: 'mirrored', labelEn: 'Mirrored Doors', labelAr: 'ابواب مع مراية', type: 'checkbox' },
    ],
    hasAreaInput: true,
    areaUnit: 'sqm',
  },
  {
    id: 'bedrooms',
    nameEn: 'Bedrooms',
    nameAr: 'غرف نوم',
    options: [
      {
        id: 'bed-base',
        labelEn: 'Bed Base',
        labelAr: 'قاعدة السرير',
        type: 'group',
        groups: [
          {
            id: 'size',
            labelEn: 'Size',
            labelAr: 'الحجم',
            type: 'radio',
            choices: [
              { id: 'single', labelEn: 'Single', labelAr: 'مفرد' },
              { id: 'double', labelEn: 'Double', labelAr: 'مزدوج' },
            ],
          },
          {
            id: 'material',
            labelEn: 'Material',
            labelAr: 'المادة',
            type: 'radio',
            choices: [
              { id: 'wood', labelEn: 'Wood', labelAr: 'خشب' },
              { id: 'upholstered', labelEn: 'Upholstered', labelAr: 'منجد' },
            ],
          },
        ],
      },
      {
        id: 'nightstand',
        labelEn: 'Nightstand',
        labelAr: 'كومودينو',
        type: 'radio',
        choices: [
          { id: 'standard', labelEn: 'Standard', labelAr: 'قياسي' },
          { id: 'custom', labelEn: 'Custom Design', labelAr: 'تصميم مخصص' },
        ],
      },
      {
        id: 'headboard',
        labelEn: 'Headboard',
        labelAr: 'رأسية السرير',
        type: 'radio',
        choices: [
          { id: 'wood', labelEn: 'Wood', labelAr: 'خشب' },
          { id: 'upholstered', labelEn: 'Upholstered', labelAr: 'منجد' },
        ],
      },
    ],
  },
  {
    id: 'tv-units',
    nameEn: 'TV Units',
    nameAr: 'مكتبة تلفزيون',
    options: [
      {
        id: 'lighting',
        labelEn: 'Lighting',
        labelAr: 'إضاءة',
        type: 'radio',
        choices: [
          { id: 'with-lighting', labelEn: 'With Lighting', labelAr: 'مع إضاءة' },
          { id: 'without-lighting', labelEn: 'Without Lighting', labelAr: 'بدون إضاءة' },
        ],
      },
    ],
  },
  {
    id: 'wall-cladding',
    nameEn: 'Wall Cladding',
    nameAr: 'تلبيس حوائط',
    options: [
      {
        id: 'lighting',
        labelEn: 'Lighting',
        labelAr: 'إضاءة',
        type: 'radio',
        choices: [
          { id: 'with-lighting', labelEn: 'With Lighting', labelAr: 'مع إضاءة' },
          { id: 'without-lighting', labelEn: 'Without Lighting', labelAr: 'بدون إضاءة' },
        ],
      },
    ],
  },
  {
    id: 'prep-kitchen',
    nameEn: 'Prep Kitchens / Coffee Corner',
    nameAr: 'مطابخ تحضيرية',
    options: [
      {
        id: 'layout',
        labelEn: 'Layout',
        labelAr: 'التخطيط',
        type: 'radio',
        choices: [
          { id: 'upper-lower', labelEn: 'Upper & Lower', labelAr: 'علوي وسفلي' },
          { id: 'lower-only', labelEn: 'Lower Only', labelAr: 'سفلي فقط' },
        ],
      },
      {
        id: 'countertop',
        labelEn: 'Countertop',
        labelAr: 'سطح العمل',
        type: 'radio',
        choices: [
          { id: 'wood', labelEn: 'Wood', labelAr: 'خشب' },
          { id: 'marble', labelEn: 'Marble', labelAr: 'رخام' },
        ],
      },
      {
        id: 'lighting',
        labelEn: 'Lighting',
        labelAr: 'إضاءة',
        type: 'radio',
        choices: [
          { id: 'yes', labelEn: 'Yes', labelAr: 'نعم' },
          { id: 'no', labelEn: 'No', labelAr: 'لا' },
        ],
      },
      {
        id: 'appliances',
        labelEn: 'Appliances',
        labelAr: 'الأجهزة',
        type: 'radio',
        choices: [
          { id: 'built-in', labelEn: 'Built-in', labelAr: 'مدمجة' },
          { id: 'none', labelEn: 'None', labelAr: 'بدون' },
        ],
      },
    ],
  },
  {
    id: 'diwaniya',
    nameEn: 'Diwaniya Seating',
    nameAr: 'جلسات ديوانية',
    options: [
      {
        id: 'style',
        labelEn: 'Style',
        labelAr: 'الطراز',
        type: 'checkbox',
        choices: [
          { id: 'wood-upholstery', labelEn: 'Wood + Upholstery', labelAr: 'خشب + تنجيد' },
        ],
      },
      {
        id: 'embroidery',
        labelEn: 'Embroidery',
        labelAr: 'تطريز',
        type: 'radio',
        choices: [
          { id: 'with-embroidery', labelEn: 'With Embroidery', labelAr: 'مع تطريز' },
          { id: 'without-embroidery', labelEn: 'Without Embroidery', labelAr: 'بدون تطريز' },
        ],
      },
    ],
  },
  {
    id: 'living-room',
    nameEn: 'Living Room Seating',
    nameAr: 'جلسات معيشة',
    options: [
      {
        id: 'style',
        labelEn: 'Style',
        labelAr: 'الطراز',
        type: 'checkbox',
        choices: [
          { id: 'wood-upholstery', labelEn: 'Wood + Upholstery', labelAr: 'خشب + تنجيد' },
        ],
      },
    ],
  },
  {
    id: 'hidden-doors',
    nameEn: 'Hidden Doors',
    nameAr: 'ابواب مخفية',
    options: [
      {
        id: 'type',
        labelEn: 'Door Type',
        labelAr: 'نوع الباب',
        type: 'radio',
        choices: [
          { id: 'sliding', labelEn: 'Sliding', labelAr: 'سحاب' },
          { id: 'hinged', labelEn: 'Hinged', labelAr: 'مفصلات' },
        ],
      },
    ],
  },
];

export const projectScopes = [
  { id: 'full-project', labelEn: 'Full Project / Major', labelAr: 'مشاريع كبيرة' },
  { id: 'renovation', labelEn: 'Renovation', labelAr: 'ترميم' },
  { id: 'specific-unit', labelEn: 'Specific Unit', labelAr: 'وحدة محددة' },
  { id: 'doors-only', labelEn: 'Doors Only', labelAr: 'أبواب فقط' },
];

export const urgencyLevels = [
  { id: 'urgent', labelEn: 'Urgent', labelAr: 'عاجل' },
  { id: 'soon', labelEn: 'Soon', labelAr: 'قريباً' },
  { id: 'planning', labelEn: 'Planning', labelAr: 'تخطيط' },
  { id: 'exploring', labelEn: 'Just Exploring', labelAr: 'استكشاف فقط' },
];

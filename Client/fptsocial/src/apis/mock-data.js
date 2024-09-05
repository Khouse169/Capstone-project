export const mockSearchData = {
  data: [{
    'id': 1,
    'text': 'Devpulse',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 2,
    'text': 'Linklinks',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 3,
    'text': 'Centizu',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 4,
    'text': 'Dynabox',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 5,
    'text': 'Avaveo',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 6,
    'text': 'Demivee',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 7,
    'text': 'Jayo',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 8,
    'text': 'Blognation',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 9,
    'text': 'Podcat',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }, {
    'id': 10,
    'text': 'Layo',
    'avatar': 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'
  }]
}

export const comment = [
  {
    'id': 1,
    'user': {
      'id': 101,
      'username': 'user1',
      'avatar': 'https://images.unsplash.com/photo-1502767089025-6572583495b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80'
    },
    'content': 'This is the first comment.',
    'timestamp': '2024-06-30T12:34:56Z',
    'level': 1,
    'replies': [
      {
        'id': 2,
        'user': {
          'id': 102,
          'username': 'user2',
          'avatar': 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80'
        },
        'content': 'This is a reply to the first comment.',
        'timestamp': '2024-06-30T13:00:00Z',
        'level': 2,
        'replies': []
      },
      {
        'id': 3,
        'user': {
          'id': 103,
          'username': 'user3',
          'avatar': 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80'
        },
        'content': 'Another reply to the first comment.',
        'timestamp': '2024-06-30T14:00:00Z',
        'level': 2,
        'replies': [
          {
            'id': 4,
            'user': {
              'id': 101,
              'username': 'user1',
              'avatar': 'https://images.unsplash.com/photo-1502767089025-6572583495b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80'
            },
            'content': 'Nested reply to the second reply.',
            'timestamp': '2024-06-30T15:00:00Z',
            'level': 3,
            'replies': []
          }
        ]
      }
    ]
  },
  {
    'id': 5,
    'user': {
      'id': 104,
      'username': 'user4',
      'avatar': 'https://images.unsplash.com/photo-1502767071867-5a369e4c7f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80'
    },
    'content': 'This is another top-level comment.',
    'timestamp': '2024-06-30T16:00:00Z',
    'level': 1,
    'replies': []
  }
];

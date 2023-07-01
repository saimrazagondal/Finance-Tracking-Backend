exports.USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

exports.TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
};

exports.SENSITIVE_USER_FIELDS = [
  'password',
  'passwordChangedAt',
  'deactivatedAt',
];

exports.ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

exports.CATEGORIES = {
  'Food & Drinks': ['Bar & Cafe', 'Groceries', 'Restaurant, Fast-Food'],
  Shopping: [
    'Clothes & Shoes',
    'Drug-store, chemist',
    'Electronics, accessories',
    'Free time',
    'Gifts, joy',
    'Health & Beauty',
    'Home, Garden',
    'Jewels, accessories',
    'Kids',
    'Pets, animals',
    'Stationary, tools',
  ],
  Housing: [
    'Energy, utilities',
    'Maintenance, repairs',
    'Mortgage',
    'Property insurance',
    'Rent',
    'Services',
  ],
  Transportation: [
    'Business trips',
    'Long distance',
    'Public transport',
    'Taxi',
  ],
};

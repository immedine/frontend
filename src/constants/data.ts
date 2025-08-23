import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string; // Consider using a proper date type if possible
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    key: 'dashboard',
    icon: 'dashboard',
    isActive: true,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Menu',
    url: '/category',
    key: 'category',
    icon: 'category',
  },
  {
    title: 'Restaurant',
    url: '/restaurant-details',
    key: 'restaurant',
    icon: 'restaurant',
  },
  {
    title: 'Print QR',
    url: '/print-qr',
    key: 'qr',
    icon: 'qr',
  },
  // {
  //   title: 'Settings',
  //   url: '/dashboard/settings',
  //   icon: 'settings',
  //   shortcut: ['s', 't'],
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'Role',
  //       url: '/dashboard/settings/role',
  //       icon: 'role',
  //       key: 'role',
  //       shortcut: ['s', 'r']
  //     },
  //     {
  //       title: 'Sub Admin',
  //       url: '/dashboard/settings/sub-admin',
  //       icon: 'admin',
  //       key: 'subAdmin',
  //       shortcut: ['s', 'a']
  //     },
  //     {
  //       title: 'Language',
  //       url: '/dashboard/settings/language',
  //       key: 'language',
  //       icon: 'language',
  //       shortcut: ['s', 'l']
  //     },
  //     {
  //       title: 'Category',
  //       url: '/dashboard/settings/category',
  //       key: 'category',
  //       icon: 'category',
  //       shortcut: ['s', 'c']
  //     },
  //     {
  //       title: 'FAQ',
  //       url: '/dashboard/settings/faq',
  //       key: 'faq',
  //       icon: 'faq',
  //       shortcut: ['s', 'f']
  //     },
  //     {
  //       title: 'Global Config',
  //       url: '/dashboard/settings/config',
  //       key: 'globalConfig',
  //       icon: 'config',
  //       shortcut: ['s', 'g']
  //     }
  //   ]
  // },
  // {
  //   title: 'Notifications',
  //   url: '/dashboard/notifications',
  //   icon: 'notification',
  //   key: 'notification',
  //   shortcut: ['n', 't'],
  //   isActive: false,
  //   items: [] // No child items
  // }
  // {
  //   title: 'Employee',
  //   url: '/dashboard/employee',
  //   icon: 'user',
  //   shortcut: ['e', 'e'],
  //   isActive: false,
  //   items: []
  // },
  // {
  //   title: 'Product',
  //   url: '/dashboard/product',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: []
  // },
  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: true,
  //   items: [
  //     {
  //       title: 'View Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userView',
  //       shortcut: ['p', 'v']
  //     },
  //     {
  //       title: 'Edit Profile',
  //       url: '/dashboard/profile/edit',
  //       icon: 'userEdit',
  //       shortcut: ['p', 'e']
  //     },
  //     {
  //       title: 'Change Password',
  //       url: '/dashboard/profile/password',
  //       icon: 'lock',
  //       shortcut: ['p', 'c']
  //     },
  //     {
  //       title: 'Login',
  //       shortcut: ['l', 'l'],
  //       url: '/',
  //       icon: 'login'
  //     }
  //   ]
  // },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    key: 'dashboard',
    icon: 'dashboard',
    isActive: true,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Restaurant',
    url: '/restaurant',
    key: 'restaurant',
    icon: 'restaurant',
  },
  // {
  //   title: 'Settings',
  //   url: '/dashboard/settings',
  //   icon: 'settings',
  //   shortcut: ['s', 't'],
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'Role',
  //       url: '/dashboard/settings/role',
  //       icon: 'role',
  //       key: 'role',
  //       shortcut: ['s', 'r']
  //     },
  //     {
  //       title: 'Sub Admin',
  //       url: '/dashboard/settings/sub-admin',
  //       icon: 'admin',
  //       key: 'subAdmin',
  //       shortcut: ['s', 'a']
  //     },
  //     {
  //       title: 'Language',
  //       url: '/dashboard/settings/language',
  //       key: 'language',
  //       icon: 'language',
  //       shortcut: ['s', 'l']
  //     },
  //     {
  //       title: 'Category',
  //       url: '/dashboard/settings/category',
  //       key: 'category',
  //       icon: 'category',
  //       shortcut: ['s', 'c']
  //     },
  //     {
  //       title: 'FAQ',
  //       url: '/dashboard/settings/faq',
  //       key: 'faq',
  //       icon: 'faq',
  //       shortcut: ['s', 'f']
  //     },
  //     {
  //       title: 'Global Config',
  //       url: '/dashboard/settings/config',
  //       key: 'globalConfig',
  //       icon: 'config',
  //       shortcut: ['s', 'g']
  //     }
  //   ]
  // },
  // {
  //   title: 'Notifications',
  //   url: '/dashboard/notifications',
  //   icon: 'notification',
  //   key: 'notification',
  //   shortcut: ['n', 't'],
  //   isActive: false,
  //   items: [] // No child items
  // }
  // {
  //   title: 'Employee',
  //   url: '/dashboard/employee',
  //   icon: 'user',
  //   shortcut: ['e', 'e'],
  //   isActive: false,
  //   items: []
  // },
];

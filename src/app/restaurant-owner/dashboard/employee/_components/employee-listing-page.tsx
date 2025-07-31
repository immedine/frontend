import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import EmployeeTable from './employee-tables';
import { Employee } from '@/constants/data';

const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    gender: 'male',
    job: 'Software Engineer'
  },
  {
    id: 2,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    gender: 'female',
    job: 'Product Manager'
  },
  {
    id: 3,
    first_name: 'Mike',
    last_name: 'Johnson',
    email: 'mike.j@example.com',
    gender: 'male',
    job: 'Data Scientist'
  },
  {
    id: 4,
    first_name: 'Sarah',
    last_name: 'Wilson',
    email: 'sarah.w@example.com',
    gender: 'female',
    job: 'UX Designer'
  }
];

export default async function EmployeeListingPage() {
  // Get search params
  const page = Number(searchParamsCache.get('page')) || 1;
  const search = searchParamsCache.get('q');
  const gender = searchParamsCache.get('gender');
  const pageLimit = Number(searchParamsCache.get('limit')) || 10;

  // Implement simple filtering logic
  let filteredEmployees = [...SAMPLE_EMPLOYEES];

  // Apply gender filter
  if (gender) {
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.gender === gender
    );
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredEmployees = filteredEmployees.filter(
      (emp) =>
        emp.first_name.toLowerCase().includes(searchLower) ||
        emp.last_name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.job.toLowerCase().includes(searchLower)
    );
  }

  // Calculate total before pagination
  const total = filteredEmployees.length;

  // Apply pagination
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Employee (${total})`}
            description="Manage employees"
          />

          <Link
            href={'/dashboard/employee/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <EmployeeTable data={paginatedEmployees} totalData={total} />
      </div>
    </PageContainer>
  );
}

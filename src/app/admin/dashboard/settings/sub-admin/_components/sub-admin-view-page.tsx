import SubAdminForm from './sub-admin-form';

type TRoleViewPageProps = {
  subAdminId: string;
};

export default function LanguageViewPage({
  subAdminId
}: TRoleViewPageProps) {
  const pageTitle =
    subAdminId === 'new' ? 'Create New Sub-Admin' : 'Edit Sub-Admin';

  return <SubAdminForm subAdminId={subAdminId} pageTitle={pageTitle} />;
}



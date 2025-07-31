import RoleForm from './role-form';

type TRoleViewPageProps = {
  roleId: string;
};

export default function LanguageViewPage({
  roleId
}: TRoleViewPageProps) {
  const pageTitle =
    roleId === 'new' ? 'Create New Role' : 'Edit Role';

  return <RoleForm roleId={roleId} pageTitle={pageTitle} />;
}


import LanguageForm from './language-form';

type TLanguageViewPageProps = {
  languageId: string;
};

export default function LanguageViewPage({
  languageId
}: TLanguageViewPageProps) {
  const pageTitle =
    languageId === 'new' ? 'Create New Language' : 'Edit Language';

  return <LanguageForm languageId={languageId} pageTitle={pageTitle} />;
}

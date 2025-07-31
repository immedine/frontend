'use client';

import { useBulkUploadStory } from '@/hooks/content/use-story';
import { toast } from 'sonner';

export default function UploadExcelButton() {
  const { mutate: bulkUpload } = useBulkUploadStory();
  const file = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length === 0) return;

    if (!files[0].name.endsWith('.xlsx') && !files[0].name.endsWith('.xls')) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }
    const formData = new FormData();
    formData.append('excel', files[0]);
    formData.append('fileName', files[0].name);
    bulkUpload(formData);
  };


  return <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow cursor-pointer hover:bg-blue-700">

    <span>Upload Excel</span>
    <input type="file" className="hidden" onChange={file} accept='.xlsx, .xls' />
  </label>;
}

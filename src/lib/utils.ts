import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'
  }`;
}

export const isValid = ({
  requiredFields,
  formError,
  formDetails,
  updateError
}) => {
  let noError = true;
  const localError = { ...formError };

  console.log("requiredFields ", requiredFields)

  if (requiredFields && Object.keys(requiredFields).length) {
    for (let item in requiredFields) {
      if (typeof formDetails[item] === "string" && formDetails[item] !== null) {
        if (!formDetails[item].toString().trim().length) {
          noError = false;
          localError[item] = "This is required";
        } else if (item === "email") {
          const reg = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
          if (!reg.test(formDetails[item])) {
            noError = false;
            localError[item] = "Please provide a valid email";
          }
        } else {
          localError[item] = "";
        }
      } else if (typeof formDetails[item] !== "string" && formDetails[item] === null) {
        noError = false;
        localError[item] = "This is required";
      } else if (formDetails[item] === undefined) {
        noError = false;
        localError[item] = "This is required";
      } else if (typeof formDetails[item] === "object" && !Array.isArray(formDetails[item])) {
        const obj = formDetails[item];
        for (let each in obj) {
          if (!obj[each].toString().trim().length) {
            noError = false;
            localError[each] = "This is required";
          } else {
            localError[each] = "";
          }
        }

      }
    }
  }

  console.log("error ", localError, noError, formDetails)

  updateError({ ...localError });
  return noError;
};

export const getPathName = (path: string, isRoute?: boolean) => {
  const userType = path.split('/')[1];
  if (userType === 'diner') {
    return !isRoute ? 'user' : '/diner';
  } else if (userType === 'admin') {
    return !isRoute ? 'admin' : '/admin';
  } else {
    return isRoute ? '' : 'restaurant-owner';
  }
}

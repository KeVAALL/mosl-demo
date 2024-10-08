// ==============================|| UPLOAD - DETAILS  ||============================== //

export default function getDropzoneData(file, index) {
  if (typeof file === "string") {
    return {
      key: index ? `${file}-${index}` : file,
      preview: file,
    };
  }

  return {
    key: index ? `${file.name}-${index}` : file.name,
    name: file.name,
    // size: file.size,
    size: `${(file.size / 1024).toFixed(2)} KB`,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  };
}

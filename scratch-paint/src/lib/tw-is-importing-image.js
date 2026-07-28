let _importingImage = false;

export const isImportingImage = () => _importingImage;

export const setImportingImage = newImporting => {
    _importingImage = newImporting;
};

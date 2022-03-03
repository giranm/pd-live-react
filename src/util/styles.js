/* eslint-disable import/prefer-default-export */
export const reactSelectStyle = {
  // Ensure that dropdowns appear over table header
  menu: (provided) => ({
    ...provided,
    zIndex: 2,
  }),
};

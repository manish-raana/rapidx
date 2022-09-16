import toastr from "toastr";
toastr.options = {
  positionClass: "toast-top-full-width",
  hideDuration: 300,
  timeOut: 2000,
  closeMethod: "slideUp",
  hideMethod: "slideUp",
  showMethod: "slideDown",
  preventDuplicates: true,
};

const showSuccess = (data) => {
  toastr.clear();
  toastr.success(data);
};
const showError = (data) => {
  toastr.clear();
  toastr.error(data);
};
const showWarning = (data) => {
  toastr.clear();
  toastr.warning(data);
};

module.exports = {
  showSuccess,
  showWarning,
  showError,
};

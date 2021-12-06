export const updateUser = (formData) => {
  return $.ajax({
    method: "PATCH",
    url: `/api/users/${formData.get("id")}`,
    data: formData,
    contentType: false,
    processData: false
  });
}
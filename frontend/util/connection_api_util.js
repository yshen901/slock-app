export const logoutWorkspace = (workspace_id) => (
  $.ajax({
    method: "PATCH",
    url: `/api/workspace_users/${workspace_id}`,
    data: {workspace_user: {logged_in: false}}
  })
)

export const loginWorkspace = (workspace_id) => (
  $.ajax({
    method: "PATCH",
    url: `/api/workspace_users/${workspace_id}`,
    data: {workspace_user: {logged_in: true}}
  })
)
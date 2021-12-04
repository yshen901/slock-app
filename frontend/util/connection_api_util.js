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

export const inviteUser = (user_email, workspace_address) => (
  $.ajax({
    method: "POST",
    url: "/api/workspace_users",
    data: {workspace_user: {user_email: user_email, workspace_address: workspace_address}}
  })
)
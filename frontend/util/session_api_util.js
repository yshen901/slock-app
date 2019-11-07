export const signup = (user) => (
  $.ajax({
    method: "POST",
    url: "/api/users",
    data: {user}
  })
)

export const login = (user) => (
  $.ajax({
    method: "POST",
    url: "/api/session",
    data: { user }
  })
)

export const logout = () => (
  $.ajax({
    method: "DELETE",
    url: "/api/session",
  })
)

export const getWorkspace = (workspaceAddress) => (
  $.ajax({
    method: "GET",
    url: `/api/workspaces/${workspaceAddress}`
  })
)

export const getWorkspaces = () => (
  $.ajax({
    method: "GET",
    url: `/api/workspaces`
  })
)
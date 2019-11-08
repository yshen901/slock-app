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
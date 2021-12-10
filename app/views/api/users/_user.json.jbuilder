json.id user.id
json.email user.email

# Checks for user photo, and only loads a URL if a url exists!
# service_url fetches the url from AWS!
if user.photo.attached?
  json.photo_url user.photo.service_url 
end



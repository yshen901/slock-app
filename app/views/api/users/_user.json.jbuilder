json.id user.id
json.email user.email
json.full_name user.full_name
json.display_name user.display_name
json.what_i_do user.what_i_do
json.phone_number user.phone_number
json.timezone_offset user.timezone_offset

# Checks for user photo, and only loads a URL if a url exists!
# service_url fetches the url from AWS!
if user.photo.attached?
  json.photo_url user.photo.service_url 
end



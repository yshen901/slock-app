Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  
  namespace :api, defaults: { format: :json } do
    resources :users, only: :create
    resource :session, only: [:create, :destroy] #RESOURCE  
    
    resources :workspaces, only: [:index, :create]

    resources :workspaces, only: :show do
      resources :channels, only: :index
    end
    resources :channels, only: [:show, :create, :destroy]
  end

  root to: "static_pages#root"
end

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  
  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :update]
    resource :session, only: [:create, :destroy] #RESOURCE  
    
    resources :workspaces, only: [:index, :create]
    resources :workspaces, only: :show do
      resources :channels, only: :index
    end

    resources :channels, only: [:create, :update]
    resources :channels, only: :show do
      resources :messages, only: [:index]
    end

    resources :workspace_users, only: [:update, :create]
    resources :channel_users, only: [:create, :destroy, :update]

    resources :dm_channel_users, only: [:create, :update]

    resources :message_reacts, only: [:create, :destroy]
  end
  resources :calls, only: [:create]

  root to: "static_pages#root"
  mount ActionCable.server, at: '/cable' #AC
end

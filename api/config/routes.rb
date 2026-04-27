Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  namespace :api do
    namespace :v1 do
      post "auth/register", to: "auth#register"
      post "auth/login",    to: "auth#login"

      resources :videos, only: %i[index create]
    end
  end
end

# Be sure to restart your server when you modify this file.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("ALLOWED_ORIGINS", "http://localhost:3000")

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      expose: ["Authorization"]
  end
end

module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!
  end

  private

  def authenticate_user!
    header = request.headers["Authorization"]
    token  = header&.split(" ")&.last

    unless token
      render json: { error: "Authorization token missing" }, status: :unauthorized
      return
    end

    payload = JsonWebToken.decode(token)
    @current_user = User.find_by(id: payload[:user_id])

    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
  rescue JsonWebToken::DecodeError
    render json: { error: "Invalid or expired token" }, status: :unauthorized
  end

  def current_user
    @current_user
  end
end

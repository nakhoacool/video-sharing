module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token]
      raise ActionCable::Connection::Authorization::UnauthorizedError if token.blank?

      payload = JsonWebToken.decode(token)
      user = User.find_by(id: payload[:user_id])

      user || reject_unauthorized_connection
    rescue JsonWebToken::DecodeError
      reject_unauthorized_connection
    end
  end
end

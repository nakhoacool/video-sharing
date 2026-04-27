module JsonWebToken
  SECRET_KEY = Rails.application.secret_key_base
  ALGORITHM  = "HS256"
  EXPIRY     = 24.hours

  def self.encode(payload, exp: EXPIRY.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, ALGORITHM)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: ALGORITHM })[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError => e
    raise JsonWebToken::DecodeError, e.message
  end

  class DecodeError < StandardError; end
end

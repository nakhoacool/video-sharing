class AuthenticateUserService
  def initialize(user_repository: UserRepository.new)
    @user_repository = user_repository
  end

  def call(email:, password:)
    user = @user_repository.find_by_email(email)

    if user&.authenticate(password)
      token = JsonWebToken.encode({ user_id: user.id })
      ServiceResult.success({ user: user, token: token })
    else
      ServiceResult.failure([ "Invalid email or password" ])
    end
  end
end

class RegisterUserService
  def initialize(user_repository: UserRepository.new)
    @user_repository = user_repository
  end

  def call(params)
    user = @user_repository.build(params.slice(:name, :email, :password, :password_confirmation))

    if @user_repository.save(user)
      ServiceResult.success(user)
    else
      ServiceResult.failure(user.errors.full_messages)
    end
  end
end

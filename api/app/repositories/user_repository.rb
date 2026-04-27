class UserRepository
  def find_by_id(id)
    User.find_by(id: id)
  end

  def find_by_email(email)
    User.find_by(email: email)
  end

  def build(attributes)
    User.new(attributes)
  end

  def save(user)
    user.save
  end
end

class VideoRepository
  def all_ordered
    Video.includes(:user).order(created_at: :desc)
  end

  def build(attributes)
    Video.new(attributes)
  end

  def save(video)
    video.save
  end
end

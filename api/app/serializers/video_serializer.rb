class VideoSerializer
  def initialize(video)
    @video = video
  end

  def as_json(*)
    {
      id: @video.id,
      title: @video.title,
      description: @video.description,
      link: @video.link,
      created_at: @video.created_at,
      shared_by: {
        id: @video.user.id,
        name: @video.user.name
      }
    }
  end
end

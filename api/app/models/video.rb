class Video < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :link,  presence: true, format: {
    with: /\Ahttps?:\/\/(www\.)?youtube\.com\/watch\?.*v=[\w-]+|https?:\/\/youtu\.be\/[\w-]+\z/,
    message: "must be a valid YouTube URL"
  }
end

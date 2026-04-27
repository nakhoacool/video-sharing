require "rails_helper"

RSpec.describe Video, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:user) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:link) }

    it "is valid with a youtube.com URL" do
      video = build(:video, link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
      expect(video).to be_valid
    end

    it "is valid with a youtu.be short URL" do
      video = build(:video, link: "https://youtu.be/dQw4w9WgXcQ")
      expect(video).to be_valid
    end

    it "is invalid with a non-YouTube URL" do
      video = build(:video, link: "https://vimeo.com/123456")
      expect(video).not_to be_valid
      expect(video.errors[:link]).to include("must be a valid YouTube URL")
    end

    it "is invalid with a blank link" do
      video = build(:video, link: "")
      expect(video).not_to be_valid
    end
  end
end

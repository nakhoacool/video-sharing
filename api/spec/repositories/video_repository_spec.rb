require "rails_helper"

RSpec.describe VideoRepository do
  subject(:repo) { described_class.new }

  describe "#all_ordered" do
    it "returns videos newest first with user eager-loaded" do
      user  = create(:user)
      older = create(:video, user: user, created_at: 2.days.ago)
      newer = create(:video, user: user, created_at: 1.day.ago)

      result = repo.all_ordered
      expect(result.first).to eq(newer)
      expect(result.last).to eq(older)

      # assert no N+1: user is loaded without extra query
      expect(result.first.association(:user)).to be_loaded
    end
  end

  describe "#build" do
    it "instantiates a Video without persisting it" do
      user  = create(:user)
      video = repo.build(title: "Test", link: "https://youtu.be/abc123defgh", user: user)
      expect(video).to be_a(Video)
      expect(video).to be_new_record
    end
  end

  describe "#save" do
    it "persists a valid video and returns true" do
      user  = create(:user)
      video = repo.build(title: "Test", link: "https://youtu.be/abc123defgh", user: user)
      expect(repo.save(video)).to be true
      expect(video).to be_persisted
    end

    it "returns false for an invalid video" do
      video = repo.build(title: "", link: "", user: create(:user))
      expect(repo.save(video)).to be false
    end
  end
end
